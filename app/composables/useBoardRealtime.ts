import type { Participant, Vote, VotingState } from '~/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface BroadcastVoteSubmitted {
  participantId: string
}

interface BroadcastVotesRevealed {
  votes: Vote[]
}

interface BroadcastVotingStarted {
  issueId: string
}

interface BroadcastTimerEvent {
  duration?: number
}

export function useBoardRealtime(
  boardCode: string,
  boardId: Ref<string | undefined>,
  participant: Ref<Participant | undefined>,
  callbacks: {
    onParticipantsChanged?: () => void
    onIssuesChanged?: () => void
    onBoardChanged?: () => void
  },
) {
  const supabase = useSupabase()

  const onlineParticipantIds = ref<Set<string>>(new Set())
  const voteNotifications = ref<Set<string>>(new Set())
  const revealedVotes = ref<Vote[]>([])
  const votingState = ref<VotingState>('idle')
  const currentIssueId = ref<string | null>(null)
  const timerRunning = ref(false)
  const timerDuration = ref(0)
  const connectionState = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')

  let channel: RealtimeChannel | null = null
  let subscribed = false

  function getChannelName() {
    return `board:${boardCode}`
  }

  function subscribe() {
    if (subscribed || !boardId.value) return

    const channelName = getChannelName()

    // Guard against duplicate channels
    const existing = supabase.getChannels().find(ch => ch.topic === `realtime:${channelName}`)
    if (existing) {
      supabase.removeChannel(existing)
    }

    connectionState.value = 'connecting'

    channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true, self: true },
        presence: { key: participant.value?.id || 'anonymous' },
      },
    })

    // --- Presence ---
    channel.on('presence', { event: 'sync' }, () => {
      if (!channel) return
      const state = channel.presenceState()
      const ids = new Set<string>()
      for (const key of Object.keys(state)) {
        const presences = state[key] as Array<{ participant_id?: string }>
        for (const p of presences) {
          if (p.participant_id) {
            ids.add(p.participant_id)
          }
        }
      }
      onlineParticipantIds.value = ids
    })

    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      const ids = new Set(onlineParticipantIds.value)
      for (const p of newPresences as Array<{ participant_id?: string }>) {
        if (p.participant_id) {
          ids.add(p.participant_id)
        }
      }
      onlineParticipantIds.value = ids
    })

    channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const ids = new Set(onlineParticipantIds.value)
      for (const p of leftPresences as Array<{ participant_id?: string }>) {
        if (p.participant_id) {
          ids.delete(p.participant_id)
        }
      }
      onlineParticipantIds.value = ids
    })

    // --- Broadcast events ---
    channel.on('broadcast', { event: 'vote_submitted' }, ({ payload }) => {
      const data = payload as BroadcastVoteSubmitted
      if (data.participantId) {
        const updated = new Set(voteNotifications.value)
        updated.add(data.participantId)
        voteNotifications.value = updated
      }
    })

    channel.on('broadcast', { event: 'votes_revealed' }, ({ payload }) => {
      const data = payload as BroadcastVotesRevealed
      revealedVotes.value = data.votes || []
      votingState.value = 'revealed'
    })

    channel.on('broadcast', { event: 'voting_started' }, ({ payload }) => {
      const data = payload as BroadcastVotingStarted
      votingState.value = 'voting'
      currentIssueId.value = data.issueId
      voteNotifications.value = new Set()
      revealedVotes.value = []
      callbacks.onIssuesChanged?.()
      callbacks.onBoardChanged?.()
    })

    channel.on('broadcast', { event: 'voting_reset' }, () => {
      votingState.value = 'idle'
      currentIssueId.value = null
      voteNotifications.value = new Set()
      revealedVotes.value = []
      callbacks.onBoardChanged?.()
    })

    channel.on('broadcast', { event: 'timer_started' }, ({ payload }) => {
      const data = payload as BroadcastTimerEvent
      timerRunning.value = true
      timerDuration.value = data.duration || 0
    })

    channel.on('broadcast', { event: 'timer_stopped' }, () => {
      timerRunning.value = false
      timerDuration.value = 0
    })

    // --- Postgres Changes ---
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'boards',
        filter: `id=eq.${boardId.value}`,
      },
      (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const updated = payload.new as { voting_state?: VotingState; current_issue_id?: string | null }
          if (updated.voting_state) {
            votingState.value = updated.voting_state
          }
          if ('current_issue_id' in updated) {
            currentIssueId.value = updated.current_issue_id ?? null
          }
        }
        callbacks.onBoardChanged?.()
      },
    )

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `board_id=eq.${boardId.value}`,
      },
      () => {
        callbacks.onParticipantsChanged?.()
      },
    )

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'issues',
        filter: `board_id=eq.${boardId.value}`,
      },
      () => {
        callbacks.onIssuesChanged?.()
      },
    )

    // --- Subscribe ---
    channel.subscribe(async (status) => {
      switch (status) {
        case 'SUBSCRIBED':
          connectionState.value = 'connected'
          subscribed = true
          // Track presence
          if (participant.value) {
            await channel!.track({
              participant_id: participant.value.id,
              display_name: participant.value.display_name,
              role: participant.value.role,
            })
          }
          break
        case 'CHANNEL_ERROR':
          connectionState.value = 'error'
          break
        case 'TIMED_OUT':
          connectionState.value = 'error'
          break
        case 'CLOSED':
          connectionState.value = 'disconnected'
          subscribed = false
          break
      }
    })
  }

  async function trackPresence() {
    if (!channel || !participant.value || !subscribed) return
    await channel.track({
      participant_id: participant.value.id,
      display_name: participant.value.display_name,
      role: participant.value.role,
    })
  }

  // --- Broadcast helpers ---
  async function broadcastVoteSubmitted(participantId: string) {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'vote_submitted',
      payload: { participantId } satisfies BroadcastVoteSubmitted,
    })
  }

  async function broadcastVotesRevealed(votes: Vote[]) {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'votes_revealed',
      payload: { votes } satisfies BroadcastVotesRevealed,
    })
  }

  async function broadcastVotingStarted(issueId: string) {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'voting_started',
      payload: { issueId } satisfies BroadcastVotingStarted,
    })
  }

  async function broadcastVotingReset() {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'voting_reset',
      payload: {},
    })
  }

  async function broadcastTimerStarted(duration: number) {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'timer_started',
      payload: { duration } satisfies BroadcastTimerEvent,
    })
  }

  async function broadcastTimerStopped() {
    if (!channel) return
    await channel.send({
      type: 'broadcast',
      event: 'timer_stopped',
      payload: {},
    })
  }

  async function cleanup() {
    if (channel) {
      try {
        if (subscribed) {
          await channel.untrack()
        }
      }
      catch {
        // Ignore untrack errors during cleanup
      }
      try {
        supabase.removeChannel(channel)
      }
      catch {
        // Ignore removal errors
      }
      channel = null
      subscribed = false
      connectionState.value = 'disconnected'
    }
  }

  // Handle tab close
  function handleBeforeUnload() {
    if (channel && subscribed) {
      // Use synchronous untrack attempt; channel removal is best-effort
      try {
        channel.untrack()
      }
      catch {
        // Best effort on page unload
      }
    }
  }

  if (import.meta.client) {
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  // Watch for boardId becoming available to auto-subscribe
  watch(boardId, (newId) => {
    if (newId && !subscribed) {
      subscribe()
    }
  })

  // Watch for participant changes to re-track presence
  watch(participant, () => {
    if (subscribed && participant.value) {
      trackPresence()
    }
  })

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
    cleanup()
  })

  return {
    onlineParticipantIds: readonly(onlineParticipantIds),
    voteNotifications,
    revealedVotes,
    votingState,
    currentIssueId,
    timerRunning: readonly(timerRunning),
    timerDuration: readonly(timerDuration),
    connectionState: readonly(connectionState),
    subscribe,
    cleanup,
    trackPresence,
    broadcastVoteSubmitted,
    broadcastVotesRevealed,
    broadcastVotingStarted,
    broadcastVotingReset,
    broadcastTimerStarted,
    broadcastTimerStopped,
  }
}
