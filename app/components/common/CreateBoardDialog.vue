<template>
  <div class="overlay" @click.self="$emit('close')" />
  <div class="dialog" @click.self="$emit('close')">
    <div class="card max-w-md w-full animate-slide-up" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Create a Board</h2>
        <button @click="$emit('close')" class="btn-ghost p-1" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <label for="board-name" class="block text-sm font-medium text-surface-300 mb-1.5">
            Session Name
          </label>
          <input
            id="board-name"
            v-model="boardName"
            class="input"
            placeholder="e.g. Sprint 42 Planning"
            maxlength="100"
            autofocus
            required
          />
        </div>

        <div>
          <label for="display-name" class="block text-sm font-medium text-surface-300 mb-1.5">
            Your Name
          </label>
          <input
            id="display-name"
            v-model="displayName"
            class="input"
            placeholder="e.g. Alex"
            maxlength="30"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">
            Estimation Deck
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="deck in decks"
              :key="deck.id"
              type="button"
              @click="selectedDeck = deck.id"
              :class="[
                'p-3 rounded-xl border text-left transition-all text-sm',
                selectedDeck === deck.id
                  ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                  : 'border-surface-700 bg-surface-800 text-surface-300 hover:border-surface-600',
              ]"
            >
              <div class="font-medium">{{ deck.name }}</div>
              <div class="text-xs text-surface-500 mt-0.5">{{ deck.description }}</div>
            </button>
          </div>
        </div>

        <div v-if="error" class="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="creating || !boardName.trim() || !displayName.trim()"
        >
          {{ creating ? 'Creating...' : 'Create Board' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeckType } from '~/types'
import { DECK_CONFIGS } from '~/utils/deck-configs'

const emit = defineEmits<{
  close: []
  created: [id: string]
}>()

const { deviceId, getDisplayName, setDisplayName, setFacilitatorToken, addRecentBoard } = useDeviceIdentity()

const boardName = ref('')
const displayName = ref(getDisplayName())
const selectedDeck = ref<DeckType>('fibonacci')
const creating = ref(false)
const error = ref('')

const decks = Object.values(DECK_CONFIGS)

async function handleCreate() {
  if (!boardName.value.trim() || !displayName.value.trim()) return

  creating.value = true
  error.value = ''

  try {
    const result = await $fetch('/api/boards/create', {
      method: 'POST',
      body: {
        name: boardName.value.trim(),
        displayName: displayName.value.trim(),
        deviceId: deviceId.value,
        deckType: selectedDeck.value,
      },
    })

    setDisplayName(displayName.value.trim())
    setFacilitatorToken(result.board.id, result.facilitatorToken)
    addRecentBoard(result.board.id, result.board.name)
    emit('created', result.board.id)
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to create board'
  } finally {
    creating.value = false
  }
}
</script>
