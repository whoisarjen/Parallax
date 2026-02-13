import type { Board, Participant, Issue, Vote, VotingState } from '~/types'
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
  boardId: string,
  boardDbId: Ref<string | undefined>,
  participant: Ref<Participant | undefined>,
  data: {
    board: Ref<Board | null>
    participants: Ref<Participant[]>
    issues: Ref<Issue[]>
  },
) {
  const supabase = useSupabase()

  const onlineParticipantIds = ref<Set<string>>(new Set())
  const voteNotifications = ref<Set<string>>(new Set())
  const revealedVotes = ref<Vote[]>([])
  const votingState = ref<VotingState | null>(null)
  const currentIssueId = ref<string | null>(null)
  const timerRunning = ref(false)
  const timerDuration = ref(0)
  const connectionState = ref<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')

  let channel: RealtimeChannel | null = null
  let subscribed = false
  let subscribing = false
  let retryTimeout: ReturnType<typeof setTimeout> | null = null

  function subscribe() {
    // Guard: don't subscribe if already subscribed/subscribing, or board not loaded
    if (subscribed || subscribing || !boardDbId.value) return

    subscribing = true
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      retryTimeout = null
    }

    const channelName = `board:${boardId}`

    // Remove any existing channel with same name
    const existing = supabase.getChannels().find(ch => ch.topic === `realtime:${channelName}`)
    if (existing) {
      supabase.removeChannel(existing)
    }

    connectionState.value = 'connecting'

    // Use boardId directly for filters - it's always the correct UUID
    // (same value as boardDbId.value but without timing dependency)
    const dbId = boardId

    channel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: true, self: true },
        presence: { key: participant.value?.id || `anon-${Date.now()}` },
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
          if (p.participant_id) ids.add(p.participant_id)
        }
      }
      onlineParticipantIds.value = ids
    })

    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      const ids = new Set(onlineParticipantIds.value)
      for (const p of newPresences as Array<{ participant_id?: string }>) {
        if (p.participant_id) ids.add(p.participant_id)
      }
      onlineParticipantIds.value = ids
    })

    channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const ids = new Set(onlineParticipantIds.value)
      for (const p of leftPresences as Array<{ participant_id?: string }>) {
        if (p.participant_id) ids.delete(p.participant_id)
      }
      onlineParticipantIds.value = ids
    })

    // --- Broadcast events ---
    channel.on('broadcast', { event: 'vote_submitted' }, ({ payload }) => {
      const d = payload as BroadcastVoteSubmitted
      if (d.participantId) {
        const updated = new Set(voteNotifications.value)
        updated.add(d.participantId)
        voteNotifications.value = updated
      }
    })

    channel.on('broadcast', { event: 'votes_revealed' }, ({ payload }) => {
      const d = payload as BroadcastVotesRevealed
      revealedVotes.value = d.votes || []
      votingState.value = 'revealed'
    })

    channel.on('broadcast', { event: 'voting_started' }, ({ payload }) => {
      const d = payload as BroadcastVotingStarted
      votingState.value = 'voting'
      currentIssueId.value = d.issueId
      voteNotifications.value = new Set()
      revealedVotes.value = []
    })

    channel.on('broadcast', { event: 'voting_reset' }, () => {
      votingState.value = 'idle'
      currentIssueId.value = null
      voteNotifications.value = new Set()
      revealedVotes.value = []
    })

    channel.on('broadcast', { event: 'timer_started' }, ({ payload }) => {
      const d = payload as BroadcastTimerEvent
      timerRunning.value = true
      timerDuration.value = d.duration || 0
    })

    channel.on('broadcast', { event: 'timer_stopped' }, () => {
      timerRunning.value = false
      timerDuration.value = 0
    })

    // --- Postgres Changes: directly update local state from WS payloads ---

    // Board changes
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'boards', filter: `id=eq.${dbId}` },
      (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new && data.board.value) {
          const updated = payload.new as Partial<Board>
          data.board.value = { ...data.board.value, ...updated }
          if (updated.voting_state) votingState.value = updated.voting_state
          if ('current_issue_id' in updated) currentIssueId.value = updated.current_issue_id ?? null
        }
      },
    )

    // Participant changes
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'participants', filter: `board_id=eq.${dbId}` },
      (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newP = payload.new as Participant
          if (!data.participants.value.some(p => p.id === newP.id)) {
            data.participants.value = [...data.participants.value, newP]
          }
        }
        else if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedP = payload.new as Participant
          data.participants.value = data.participants.value.map(p =>
            p.id === updatedP.id ? updatedP : p,
          )
        }
        else if (payload.eventType === 'DELETE' && payload.old) {
          const oldP = payload.old as { id: string }
          data.participants.value = data.participants.value.filter(p => p.id !== oldP.id)
        }
      },
    )

    // Issue changes
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'issues', filter: `board_id=eq.${dbId}` },
      (payload) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const newI = payload.new as Issue
          if (!data.issues.value.some(i => i.id === newI.id)) {
            data.issues.value = [...data.issues.value, newI].sort(
              (a, b) => a.sort_order - b.sort_order,
            )
          }
        }
        else if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedI = payload.new as Issue
          data.issues.value = data.issues.value
            .map(i => (i.id === updatedI.id ? updatedI : i))
            .sort((a, b) => a.sort_order - b.sort_order)
        }
        else if (payload.eventType === 'DELETE' && payload.old) {
          const oldI = payload.old as { id: string }
          data.issues.value = data.issues.value.filter(i => i.id !== oldI.id)
        }
      },
    )

    // --- Subscribe ---
    channel.subscribe(async (status) => {
      subscribing = false

      switch (status) {
        case 'SUBSCRIBED':
          connectionState.value = 'connected'
          subscribed = true
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
          subscribed = false
          channel = null
          // Retry after 3 seconds
          retryTimeout = setTimeout(() => subscribe(), 3000)
          break
        case 'TIMED_OUT':
          connectionState.value = 'error'
          subscribed = false
          channel = null
          // Retry after 5 seconds
          retryTimeout = setTimeout(() => subscribe(), 5000)
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
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'vote_submitted',
      payload: { participantId } satisfies BroadcastVoteSubmitted,
    })
  }

  async function broadcastVotesRevealed(votes: Vote[]) {
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'votes_revealed',
      payload: { votes } satisfies BroadcastVotesRevealed,
    })
  }

  async function broadcastVotingStarted(issueId: string) {
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'voting_started',
      payload: { issueId } satisfies BroadcastVotingStarted,
    })
  }

  async function broadcastVotingReset() {
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'voting_reset',
      payload: {},
    })
  }

  async function broadcastTimerStarted(duration: number) {
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'timer_started',
      payload: { duration } satisfies BroadcastTimerEvent,
    })
  }

  async function broadcastTimerStopped() {
    if (!channel || !subscribed) return
    await channel.send({
      type: 'broadcast',
      event: 'timer_stopped',
      payload: {},
    })
  }

  async function cleanup() {
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      retryTimeout = null
    }
    if (channel) {
      try { if (subscribed) await channel.untrack() }
      catch { /* ignore */ }
      try { supabase.removeChannel(channel) }
      catch { /* ignore */ }
      channel = null
      subscribed = false
      subscribing = false
      connectionState.value = 'disconnected'
    }
  }

  function handleBeforeUnload() {
    if (channel && subscribed) {
      try { channel.untrack() }
      catch { /* best effort */ }
    }
  }

  if (import.meta.client) {
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  watch(boardDbId, (newId) => {
    if (newId && !subscribed && !subscribing) subscribe()
  })

  watch(participant, () => {
    if (subscribed && participant.value) trackPresence()
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
