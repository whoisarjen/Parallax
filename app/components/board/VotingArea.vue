<template>
  <div class="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
    <!-- Idle state -->
    <div v-if="votingState === 'idle'" class="text-center space-y-4 animate-fade-in">
      <div class="w-20 h-20 mx-auto rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
        <svg class="w-10 h-10 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-surface-300">
          {{ isFacilitator ? 'Select an issue to start voting' : 'Waiting for facilitator to start voting' }}
        </h2>
        <p class="text-sm text-surface-500 mt-1">
          {{ isFacilitator ? 'Click on an issue in the sidebar to begin' : 'The facilitator will start a vote soon' }}
        </p>
      </div>
    </div>

    <!-- Voting state: show face-down cards -->
    <div v-else-if="votingState === 'voting'" class="w-full max-w-2xl space-y-6 animate-fade-in">
      <!-- Current issue info -->
      <div v-if="currentIssue" class="text-center">
        <div class="badge-primary mb-2">Currently Voting</div>
        <h2 class="text-xl font-bold text-surface-100">{{ currentIssue.title }}</h2>
        <p v-if="currentIssue.description" class="text-sm text-surface-400 mt-1 line-clamp-2">
          {{ currentIssue.description }}
        </p>
        <a
          v-if="currentIssue.jira_url"
          :href="currentIssue.jira_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 mt-1"
        >
          {{ currentIssue.jira_key || 'View in Jira' }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <!-- Face-down participant cards grid -->
      <div class="flex flex-wrap justify-center gap-4">
        <div
          v-for="p in votingParticipants"
          :key="p.id"
          class="flex flex-col items-center gap-2"
        >
          <BoardVoteCard
            :value="'?'"
            :face-down="true"
            :revealed="false"
            :disabled="true"
          />
          <div class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 rounded-full"
              :class="hasVoted(p.id) ? 'bg-emerald-400' : 'bg-surface-600 animate-pulse-soft'"
            />
            <span class="text-xs text-surface-400 truncate max-w-[80px]">{{ p.display_name }}</span>
          </div>
        </div>
      </div>

      <!-- Waiting message -->
      <div v-if="waitingFor.length > 0" class="text-center">
        <p class="text-sm text-surface-500">
          Waiting for: <span class="text-surface-400">{{ waitingFor.join(', ') }}</span>
        </p>
      </div>
      <div v-else class="text-center">
        <p class="text-sm text-emerald-400 font-medium">All votes are in!</p>
      </div>

      <!-- Facilitator reveal button -->
      <div v-if="isFacilitator" class="flex justify-center pt-2">
        <button
          @click="$emit('reveal')"
          class="btn-primary px-8"
          :disabled="votedCount === 0"
        >
          Reveal Votes ({{ votedCount }}/{{ votingParticipants.length }})
        </button>
      </div>
    </div>

    <!-- Revealed state: show flipped cards + results -->
    <div v-else-if="votingState === 'revealed'" class="w-full max-w-2xl space-y-6 animate-fade-in">
      <!-- Current issue info -->
      <div v-if="currentIssue" class="text-center">
        <div class="badge-warning mb-2">Votes Revealed</div>
        <h2 class="text-xl font-bold text-surface-100">{{ currentIssue.title }}</h2>
      </div>

      <!-- Revealed participant cards with values -->
      <div class="flex flex-wrap justify-center gap-4">
        <div
          v-for="p in votingParticipants"
          :key="p.id"
          class="flex flex-col items-center gap-2"
        >
          <BoardVoteCard
            :value="'?'"
            :face-down="true"
            :revealed="true"
            :revealed-value="getVoteValue(p.id)"
            :disabled="true"
          />
          <span class="text-xs text-surface-400 truncate max-w-[80px]">{{ p.display_name }}</span>
        </div>
      </div>

      <!-- Vote results -->
      <BoardVoteResults
        :votes="revealedVotes"
        :is-facilitator="isFacilitator"
        @save-estimate="$emit('saveEstimate', $event)"
      />

      <!-- Facilitator actions -->
      <div v-if="isFacilitator" class="flex justify-center gap-3 pt-2">
        <button @click="$emit('revote')" class="btn-secondary">
          Re-vote
        </button>
        <button @click="$emit('reset')" class="btn-ghost">
          Skip / Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Participant, Vote, VotingState, Issue } from '~/types'

const props = defineProps<{
  votingState: VotingState
  participants: Participant[]
  currentIssue: Issue | null
  votedParticipantIds: Set<string>
  revealedVotes: Vote[]
  isFacilitator: boolean
}>()

defineEmits<{
  reveal: []
  revote: []
  reset: []
  saveEstimate: [value: string]
}>()

const votingParticipants = computed(() => {
  return props.participants.filter(p => p.role !== 'spectator')
})

const votedCount = computed(() => {
  return votingParticipants.value.filter(p => props.votedParticipantIds.has(p.id)).length
})

const waitingFor = computed(() => {
  return votingParticipants.value
    .filter(p => !props.votedParticipantIds.has(p.id))
    .map(p => p.display_name)
})

function hasVoted(participantId: string): boolean {
  return props.votedParticipantIds.has(participantId)
}

function getVoteValue(participantId: string): string {
  const vote = props.revealedVotes.find(v => v.participant_id === participantId)
  return vote?.value || '--'
}
</script>
