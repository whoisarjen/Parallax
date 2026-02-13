<template>
  <header class="border-b border-surface-800 bg-surface-950/80 backdrop-blur-md sticky top-0 z-30">
    <div class="px-4 sm:px-6">
      <div class="flex items-center justify-between h-14">
        <!-- Left: Back + Board name -->
        <div class="flex items-center gap-3 min-w-0">
          <NuxtLink to="/my-boards" class="btn-ghost p-2 shrink-0" aria-label="Back to My Boards">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div class="min-w-0">
            <h1 class="text-base font-bold text-surface-100 truncate">{{ board.name }}</h1>
          </div>
        </div>

        <!-- Center: Board code + copy -->
        <div class="hidden sm:flex items-center gap-2">
          <button
            @click="copyCode"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors group"
            title="Copy board code"
          >
            <span class="font-mono text-sm font-semibold text-surface-300 group-hover:text-surface-100">
              {{ board.code }}
            </span>
            <svg
              v-if="!codeCopied"
              class="w-4 h-4 text-surface-500 group-hover:text-surface-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        <!-- Right: Share + Online count + Settings -->
        <div class="flex items-center gap-2">
          <!-- Online participants count -->
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-800/50 text-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span class="text-surface-400">
              {{ onlineCount }}
            </span>
          </div>

          <!-- Share button -->
          <div class="relative">
            <button
              @click="showSharePanel = !showSharePanel"
              class="btn-ghost p-2"
              aria-label="Share board"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            <!-- Share panel dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showSharePanel"
                class="absolute right-0 mt-2 w-72 rounded-xl bg-surface-800 border border-surface-700 shadow-xl p-4 space-y-3 z-50"
              >
                <div class="text-sm font-semibold text-surface-200 mb-2">Share this board</div>

                <!-- Copy link -->
                <button
                  @click="copyLink"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-700/50 hover:bg-surface-700 transition-colors text-left"
                >
                  <svg class="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-surface-200">{{ linkCopied ? 'Link copied!' : 'Copy link' }}</div>
                    <div class="text-xs text-surface-500 truncate">{{ boardUrl }}</div>
                  </div>
                </button>

                <!-- Copy code -->
                <button
                  @click="copyCode"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-700/50 hover:bg-surface-700 transition-colors text-left"
                >
                  <svg class="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <div>
                    <div class="text-sm font-medium text-surface-200">{{ codeCopied ? 'Code copied!' : 'Copy code' }}</div>
                    <div class="text-xs text-surface-500 font-mono">{{ board.code }}</div>
                  </div>
                </button>

                <!-- Web Share API -->
                <button
                  v-if="canShare"
                  @click="shareNative"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-700/50 hover:bg-surface-700 transition-colors text-left"
                >
                  <svg class="w-5 h-5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <div class="text-sm font-medium text-surface-200">Share via...</div>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Settings (facilitator only) -->
          <button
            v-if="isFacilitator"
            @click="$emit('openSettings')"
            class="btn-ghost p-2"
            aria-label="Board settings"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile code bar -->
    <div class="sm:hidden border-t border-surface-800/50 px-4 py-2 flex items-center justify-center gap-2">
      <button
        @click="copyCode"
        class="flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-200 transition-colors"
      >
        <span class="font-mono font-semibold">{{ board.code }}</span>
        <svg
          v-if="!codeCopied"
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg
          v-else
          class="w-3.5 h-3.5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Board } from '~/types'

const props = defineProps<{
  board: Board
  onlineCount: number
  isFacilitator: boolean
}>()

defineEmits<{
  openSettings: []
}>()

const showSharePanel = ref(false)
const codeCopied = ref(false)
const linkCopied = ref(false)

const boardUrl = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/board/${props.board.code}`
  }
  return `/board/${props.board.code}`
})

const canShare = computed(() => {
  return import.meta.client && !!navigator.share
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.board.code)
    codeCopied.value = true
    setTimeout(() => { codeCopied.value = false }, 2000)
  }
  catch {
    // Fallback: do nothing
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(boardUrl.value)
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  }
  catch {
    // Fallback
  }
}

async function shareNative() {
  if (!navigator.share) return
  try {
    await navigator.share({
      title: `Join "${props.board.name}" on Parallax`,
      text: `Join my planning poker session! Code: ${props.board.code}`,
      url: boardUrl.value,
    })
    showSharePanel.value = false
  }
  catch {
    // User cancelled or share failed
  }
}

// Close share panel on outside click
function handleClickOutside(e: MouseEvent) {
  if (showSharePanel.value) {
    const target = e.target as HTMLElement
    if (!target.closest('[aria-label="Share board"]') && !target.closest('.share-panel')) {
      showSharePanel.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
