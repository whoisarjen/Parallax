<template>
  <div class="min-h-screen flex flex-col bg-surface-950">
    <!-- Loading state -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
        <p class="text-surface-400 text-sm">Loading board...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-4">
      <div class="card max-w-md w-full text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="errorStatus === 410"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-surface-100">
          {{ errorStatus === 410 ? 'Board Expired' : errorStatus === 404 ? 'Board Not Found' : 'Something went wrong' }}
        </h2>
        <p class="text-surface-400 text-sm">{{ error }}</p>
        <div class="flex justify-center gap-3">
          <NuxtLink to="/" class="btn-primary">Go Home</NuxtLink>
          <NuxtLink to="/my-boards" class="btn-secondary">My Boards</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Join prompt (non-participant) -->
    <div v-else-if="board && !myParticipant && !joining" class="flex-1 flex items-center justify-center p-4">
      <div class="card max-w-md w-full space-y-6 animate-slide-up">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-surface-100">{{ board.name }}</h2>
          <p class="text-surface-400 text-sm mt-1">Join this planning poker session</p>
        </div>

        <!-- Current participants preview -->
        <div v-if="participants.length > 0" class="flex items-center justify-center gap-2">
          <div class="flex -space-x-2">
            <div
              v-for="p in participants.slice(0, 5)"
              :key="p.id"
              class="w-8 h-8 rounded-full bg-surface-700 border-2 border-surface-900 flex items-center justify-center text-xs font-bold text-surface-300"
              :title="p.display_name"
            >
              {{ p.display_name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <span class="text-sm text-surface-500">
            {{ participants.length }} participant{{ participants.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <form @submit.prevent="handleJoin" class="space-y-4">
          <div>
            <label for="join-name" class="block text-sm font-medium text-surface-300 mb-1.5">
              Your Name
            </label>
            <input
              id="join-name"
              v-model="joinDisplayName"
              class="input"
              placeholder="e.g. Alex"
              maxlength="30"
              autofocus
              required
            />
          </div>

          <div v-if="joinError" class="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
            {{ joinError }}
          </div>

          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="!joinDisplayName.trim() || joinSubmitting"
          >
            {{ joinSubmitting ? 'Joining...' : 'Join as Voter' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Board view -->
    <template v-else-if="board && myParticipant">
      <BoardBoardHeader
        :board="board"
        :online-count="onlineParticipantIds.size"
        :is-facilitator="isFacilitator"
        @open-settings="showSettings = true"
      />

      <div class="flex-1 flex flex-col lg:flex-row min-h-0">
        <!-- Left sidebar: Issues -->
        <aside
          class="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-surface-800 flex-shrink-0 overflow-hidden"
          :class="mobileTab === 'issues' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'"
        >
          <BoardIssueList
            :issues="issues"
            :current-issue-id="currentIssueId"
            :is-facilitator="isFacilitator"
            :board-code="boardCode"
            @start-voting="handleStartVoting"
            @issue-added="refreshIssues"
            @issue-deleted="refreshIssues"
          />
        </aside>

        <!-- Center: Voting area + Card deck -->
        <main
          class="flex-1 flex flex-col min-h-0 overflow-hidden"
          :class="mobileTab === 'vote' ? '' : 'hidden lg:flex'"
        >
          <div class="flex-1 overflow-y-auto">
            <BoardVotingArea
              :voting-state="activeVotingState"
              :participants="participants"
              :current-issue="currentIssue"
              :voted-participant-ids="voteNotifications"
              :revealed-votes="revealedVotes"
              :is-facilitator="isFacilitator"
              @reveal="handleReveal"
              @revote="handleRevote"
              @reset="handleReset"
              @save-estimate="handleSaveEstimate"
            />
          </div>

          <!-- Card deck at bottom -->
          <div
            v-if="activeVotingState === 'voting' && canVote"
            class="border-t border-surface-800 bg-surface-900/50 backdrop-blur-sm"
          >
            <BoardCardDeck
              :cards="deckCards"
              :disabled="submittingVote"
              :selected-value="myVoteValue"
              @select="handleVoteSelect"
            />
          </div>
        </main>

        <!-- Right sidebar: Participants -->
        <aside
          class="w-full lg:w-64 xl:w-72 border-t lg:border-t-0 lg:border-l border-surface-800 flex-shrink-0 overflow-hidden"
          :class="mobileTab === 'people' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'"
        >
          <BoardParticipantList
            :participants="participants"
            :current-participant-id="myParticipant.id"
            :online-participant-ids="onlineParticipantIds"
            :voted-participant-ids="voteNotifications"
            :voting-active="activeVotingState === 'voting'"
            :is-facilitator="isFacilitator"
            @change-role="handleChangeRole"
            @kick="handleKick"
          />
        </aside>
      </div>

      <!-- Mobile tab bar -->
      <nav class="lg:hidden border-t border-surface-800 bg-surface-900/90 backdrop-blur-sm flex">
        <button
          @click="mobileTab = 'issues'"
          class="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
          :class="mobileTab === 'issues' ? 'text-primary-400' : 'text-surface-500'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Issues
        </button>
        <button
          @click="mobileTab = 'vote'"
          class="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors relative"
          :class="mobileTab === 'vote' ? 'text-primary-400' : 'text-surface-500'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Vote
          <span
            v-if="activeVotingState === 'voting'"
            class="absolute top-2 right-1/4 w-2 h-2 bg-primary-500 rounded-full"
          />
        </button>
        <button
          @click="mobileTab = 'people'"
          class="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors"
          :class="mobileTab === 'people' ? 'text-primary-400' : 'text-surface-500'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          People
        </button>
      </nav>

      <!-- Board Settings Modal -->
      <BoardBoardSettings
        v-if="showSettings && board && facilitatorToken"
        :board="board"
        :facilitator-token="facilitatorToken"
        @close="showSettings = false"
        @saved="fetchBoard"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Participant, Vote, ParticipantRole } from '~/types'
import { getDeckCards } from '~/utils/deck-configs'

definePageMeta({
  layout: 'board',
})

const route = useRoute()
const boardCode = route.params.code as string

// Device identity
const { deviceId, getDisplayName, setDisplayName, getFacilitatorToken, addRecentBoard } = useDeviceIdentity()

// Board data
const { board, participants, issues, loading, error, errorStatus, fetchBoard, refreshParticipants, refreshIssues } = useBoard(boardCode)

// Mobile tab
const mobileTab = ref<'issues' | 'vote' | 'people'>('vote')
const showSettings = ref(false)

// Join state
const joinDisplayName = ref('')
const joinSubmitting = ref(false)
const joinError = ref('')
const joining = ref(false)

// Voting
const { myVote, submitting: submittingVote, submitVote, clearMyVote } = useVoting()

// Current participant for this device
const myParticipant = computed<Participant | undefined>(() => {
  if (!participants.value.length) return undefined
  return participants.value.find(p => p.device_id === deviceId.value)
})

// Is facilitator?
const isFacilitator = computed(() => {
  return myParticipant.value?.role === 'facilitator'
})

// Can this participant vote?
const canVote = computed(() => {
  const role = myParticipant.value?.role
  return role === 'voter' || role === 'facilitator'
})

// Facilitator token
const facilitatorToken = computed(() => {
  return getFacilitatorToken(boardCode)
})

// Deck cards
const deckCards = computed(() => {
  if (!board.value) return []
  return getDeckCards(board.value.deck_type, board.value.custom_deck)
})

// Board ID ref for realtime
const boardIdRef = computed(() => board.value?.id)

// Realtime
const {
  onlineParticipantIds,
  voteNotifications,
  revealedVotes,
  votingState: realtimeVotingState,
  currentIssueId: realtimeCurrentIssueId,
  subscribe: subscribeRealtime,
  broadcastVoteSubmitted,
  broadcastVotesRevealed,
  broadcastVotingStarted,
  broadcastVotingReset,
} = useBoardRealtime(boardCode, boardIdRef, myParticipant, {
  onParticipantsChanged: () => refreshParticipants(),
  onIssuesChanged: () => refreshIssues(),
  onBoardChanged: () => {
    // Refresh board to get latest state
    fetchBoard()
  },
})

// Active voting state (prefer realtime, fallback to board data)
const activeVotingState = computed(() => {
  return realtimeVotingState.value || board.value?.voting_state || 'idle'
})

// Current issue ID
const currentIssueId = computed(() => {
  return realtimeCurrentIssueId.value || board.value?.current_issue_id || null
})

// Current issue object
const currentIssue = computed(() => {
  if (!currentIssueId.value) return null
  return issues.value.find(i => i.id === currentIssueId.value) || null
})

// My current vote value
const myVoteValue = computed(() => {
  return myVote.value?.value || null
})

// --- Handlers ---

async function handleJoin() {
  if (!joinDisplayName.value.trim()) return

  joinSubmitting.value = true
  joinError.value = ''
  joining.value = true

  try {
    await $fetch('/api/boards/join', {
      method: 'POST',
      body: {
        code: boardCode,
        displayName: joinDisplayName.value.trim(),
        deviceId: deviceId.value,
      },
    })

    setDisplayName(joinDisplayName.value.trim())
    if (board.value) {
      addRecentBoard(board.value.code, board.value.name)
    }

    // Refresh board data to get updated participants
    await fetchBoard()
    joining.value = false

    // Subscribe to realtime once we have a participant
    if (boardIdRef.value) {
      subscribeRealtime()
    }
  }
  catch (e: any) {
    joinError.value = e.data?.message || 'Failed to join board'
    joining.value = false
  }
  finally {
    joinSubmitting.value = false
  }
}

async function handleVoteSelect(value: string) {
  if (!myParticipant.value || !currentIssueId.value) return

  // Toggle: clicking same card deselects (we still send the vote though)
  const voteValue = myVoteValue.value === value ? value : value

  try {
    await submitVote(currentIssueId.value, myParticipant.value.id, boardCode, voteValue)
    await broadcastVoteSubmitted(myParticipant.value.id)
  }
  catch (e: any) {
    console.error('Failed to submit vote:', e)
  }
}

async function handleStartVoting(issueId: string) {
  if (!isFacilitator.value || !facilitatorToken.value) return

  try {
    await $fetch(`/api/boards/${boardCode}/start-voting`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${facilitatorToken.value}` },
      body: { issueId },
    })

    clearMyVote()
    await broadcastVotingStarted(issueId)
    await fetchBoard()

    // Switch to vote tab on mobile
    mobileTab.value = 'vote'
  }
  catch (e: any) {
    console.error('Failed to start voting:', e)
  }
}

async function handleReveal() {
  if (!isFacilitator.value || !facilitatorToken.value) return

  try {
    const result: any = await $fetch(`/api/boards/${boardCode}/reveal`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${facilitatorToken.value}` },
    })

    await broadcastVotesRevealed(result.votes as Vote[])
    await fetchBoard()
  }
  catch (e: any) {
    console.error('Failed to reveal votes:', e)
  }
}

async function handleRevote() {
  if (!isFacilitator.value || !facilitatorToken.value || !currentIssueId.value) return

  // Start voting on the same issue again
  await handleStartVoting(currentIssueId.value)
}

async function handleReset() {
  if (!isFacilitator.value || !facilitatorToken.value) return

  try {
    await $fetch(`/api/boards/${boardCode}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${facilitatorToken.value}` },
    })

    clearMyVote()
    await broadcastVotingReset()
    await fetchBoard()
  }
  catch (e: any) {
    console.error('Failed to reset voting:', e)
  }
}

async function handleSaveEstimate(value: string) {
  if (!isFacilitator.value || !facilitatorToken.value || !currentIssueId.value) return

  try {
    await $fetch(`/api/boards/${boardCode}/save-estimate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${facilitatorToken.value}` },
      body: {
        issueId: currentIssueId.value,
        estimate: value,
      },
    })

    clearMyVote()
    await broadcastVotingReset()
    await fetchBoard()
  }
  catch (e: any) {
    console.error('Failed to save estimate:', e)
  }
}

async function handleChangeRole(participantId: string, role: ParticipantRole) {
  if (!isFacilitator.value || !facilitatorToken.value) return

  const { updateRole } = useParticipants(boardCode)

  try {
    await updateRole(participantId, role, facilitatorToken.value)
    await refreshParticipants()
  }
  catch (e: any) {
    console.error('Failed to update role:', e)
  }
}

async function handleKick(participantId: string) {
  if (!isFacilitator.value || !facilitatorToken.value) return

  const { removeParticipant } = useParticipants(boardCode)

  try {
    await removeParticipant(participantId, facilitatorToken.value)
    await refreshParticipants()
  }
  catch (e: any) {
    console.error('Failed to remove participant:', e)
  }
}

// --- Initialize ---

onMounted(async () => {
  // Pre-fill display name
  joinDisplayName.value = getDisplayName()

  // Fetch board data
  await fetchBoard()

  // If already a participant, subscribe to realtime
  if (myParticipant.value && boardIdRef.value) {
    if (board.value) {
      addRecentBoard(board.value.code, board.value.name)
    }
    subscribeRealtime()

    // Sync initial voting state
    if (board.value) {
      realtimeVotingState.value = board.value.voting_state
      realtimeCurrentIssueId.value = board.value.current_issue_id
    }
  }
})

// Page title
useHead({
  title: computed(() => board.value ? `${board.value.name} - Parallax` : 'Board - Parallax'),
})
</script>
