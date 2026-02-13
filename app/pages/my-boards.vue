<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight">My Boards</h1>
      <p class="mt-2 text-surface-400">
        Boards you've created or participated in.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-surface-800" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-surface-800 rounded w-1/3" />
            <div class="h-3 bg-surface-800 rounded w-1/5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card text-center py-12">
      <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <p class="text-surface-400">{{ error }}</p>
      <button class="btn-primary mt-4" @click="fetchBoards">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!owned.length && !participated.length" class="card text-center py-16">
      <div
        class="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-5"
      >
        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-surface-100">No boards yet</h2>
      <p class="mt-2 text-surface-400 max-w-sm mx-auto">
        Create your first planning poker session and start estimating with your team.
      </p>
      <NuxtLink to="/" class="btn-primary inline-flex items-center gap-2 mt-6">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Your First Board
      </NuxtLink>
    </div>

    <!-- Boards content -->
    <div v-else class="space-y-10">
      <!-- Created by Me -->
      <section v-if="owned.length > 0">
        <h2 class="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          Created by Me
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="board in owned"
            :key="board.id"
            :to="`/board/${board.code}`"
            class="card-hover group"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-surface-100 truncate group-hover:text-primary-300 transition-colors">
                  {{ board.name }}
                </h3>
                <p class="text-xs font-mono text-surface-500 mt-1">
                  {{ board.code }}
                </p>
              </div>
              <span :class="statusBadgeClass(board.voting_state)">
                {{ statusLabel(board.voting_state) }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="badge-neutral text-xs">
                {{ deckLabel(board.deck_type) }}
              </span>
              <span class="text-xs text-surface-500">
                {{ formatRelativeDate(board.created_at) }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Participated In -->
      <section v-if="participated.length > 0">
        <h2 class="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          Participated In
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="board in participated"
            :key="board.id"
            :to="`/board/${board.code}`"
            class="card-hover group"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-surface-100 truncate group-hover:text-primary-300 transition-colors">
                  {{ board.name }}
                </h3>
                <p class="text-xs font-mono text-surface-500 mt-1">
                  {{ board.code }}
                </p>
              </div>
              <span :class="statusBadgeClass(board.voting_state)">
                {{ statusLabel(board.voting_state) }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="badge-neutral text-xs">
                {{ deckLabel(board.deck_type) }}
              </span>
              <span class="text-xs text-surface-500">
                {{ formatRelativeDate(board.created_at) }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VotingState, DeckType } from '~/types'
import { DECK_CONFIGS } from '~/utils/deck-configs'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'My Boards - Parallax',
})

interface BoardSummary {
  id: string
  code: string
  name: string
  deck_type: DeckType
  voting_state: VotingState
  created_at: string
  expires_at: string
}

const { deviceId } = useDeviceIdentity()

const owned = ref<BoardSummary[]>([])
const participated = ref<BoardSummary[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(() => {
  fetchBoards()
})

async function fetchBoards() {
  loading.value = true
  error.value = null

  try {
    const data = await $fetch<{ owned: BoardSummary[]; participated: BoardSummary[] }>(
      '/api/boards/my-boards',
      { params: { deviceId: deviceId.value } },
    )

    owned.value = data.owned
    participated.value = data.participated
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load boards'
  } finally {
    loading.value = false
  }
}

function statusBadgeClass(state: VotingState): string {
  switch (state) {
    case 'voting':
      return 'badge-warning'
    case 'revealed':
      return 'badge-success'
    default:
      return 'badge-neutral'
  }
}

function statusLabel(state: VotingState): string {
  switch (state) {
    case 'voting':
      return 'Voting'
    case 'revealed':
      return 'Revealed'
    default:
      return 'Idle'
  }
}

function deckLabel(deckType: DeckType): string {
  if (deckType === 'custom') return 'Custom'
  return DECK_CONFIGS[deckType as Exclude<DeckType, 'custom'>]?.name ?? deckType
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
</script>
