<template>
  <div>
    <!-- Landing sections -->
    <LandingHero @create="openCreateDialog" @join="handleJoinFromHero" />
    <LandingHowItWorks />
    <LandingFeatures />

    <!-- Recent Boards section -->
    <section v-if="recentBoards.length > 0" class="py-16 sm:py-20 reveal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Continue</p>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Recent Boards
          </h2>
          <p class="mt-3 text-surface-400">
            Pick up where you left off.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <NuxtLink
            v-for="board in recentBoards"
            :key="board.id"
            :to="`/board/${board.id}`"
            class="card-hover flex items-center gap-4 group"
          >
            <div
              class="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 group-hover:bg-primary-500/15 transition-colors"
            >
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-surface-100 truncate">
                {{ board.name }}
              </p>
            </div>
            <svg class="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </NuxtLink>
        </div>

        <div class="text-center mt-6">
          <NuxtLink to="/my-boards" class="btn-ghost text-sm inline-flex items-center gap-1.5">
            View all boards
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <LandingOpenSource />
    <LandingCTA @create="openCreateDialog" @join="showJoinDialog = true" />

    <!-- Join dialog -->
    <CommonJoinBoardDialog
      v-if="showJoinDialog"
      @close="showJoinDialog = false"
      @joined="handleJoined"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useScrollReveal()

const { openCreateDialog } = useCreateDialog()
const { getRecentBoards, getDisplayName, setDisplayName, addRecentBoard, deviceId } = useDeviceIdentity()

const showJoinDialog = ref(false)

const recentBoards = ref<Array<{ id: string; name: string; createdAt: string }>>([])

onMounted(() => {
  recentBoards.value = getRecentBoards().slice(0, 6)
})

function handleJoinFromHero(boardId: string) {
  const displayName = getDisplayName()
  if (displayName) {
    joinBoard(boardId, displayName)
  } else {
    // Navigate directly to the board page which has its own join UI
    navigateTo(`/board/${boardId}`)
  }
}

function handleJoined(boardId: string) {
  showJoinDialog.value = false
  navigateTo(`/board/${boardId}`)
}

async function joinBoard(boardId: string, displayName: string) {
  try {
    await $fetch('/api/boards/join', {
      method: 'POST',
      body: {
        boardId,
        displayName,
        deviceId: deviceId.value,
      },
    })

    setDisplayName(displayName)
    addRecentBoard(boardId, displayName)
    navigateTo(`/board/${boardId}`)
  } catch {
    // If join fails, navigate to the board page which has its own join UI
    navigateTo(`/board/${boardId}`)
  }
}
</script>
