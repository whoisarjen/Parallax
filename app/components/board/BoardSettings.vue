<template>
  <div class="overlay" @click.self="$emit('close')" />
  <div class="dialog" @click.self="$emit('close')">
    <div class="card max-w-md w-full animate-slide-up" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Board Settings</h2>
        <button @click="$emit('close')" class="btn-ghost p-1" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-5">
        <!-- Board Name -->
        <div>
          <label for="settings-name" class="block text-sm font-medium text-surface-300 mb-1.5">
            Board Name
          </label>
          <input
            id="settings-name"
            v-model="name"
            class="input"
            placeholder="e.g. Sprint 42 Planning"
            maxlength="100"
            required
          />
        </div>

        <!-- Deck Type -->
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

        <!-- Timer Duration -->
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">
            Timer Duration
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in timerOptions"
              :key="option.value"
              type="button"
              @click="selectedTimer = option.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                selectedTimer === option.value
                  ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                  : 'border-surface-700 bg-surface-800 text-surface-300 hover:border-surface-600',
              ]"
            >
              {{ option.label }}
            </button>
          </div>
          <!-- Custom timer input -->
          <div v-if="selectedTimer === 0" class="mt-2 flex items-center gap-2">
            <input
              v-model.number="customTimerValue"
              type="number"
              min="10"
              max="600"
              class="input w-24 text-center"
              placeholder="60"
            />
            <span class="text-sm text-surface-400">seconds</span>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <!-- Save -->
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="saving || !name.trim()"
        >
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board, DeckType } from '~/types'
import { DECK_CONFIGS } from '~/utils/deck-configs'

const props = defineProps<{
  board: Board
  facilitatorToken: string
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const name = ref(props.board.name)
const selectedDeck = ref<DeckType>(props.board.deck_type)
const selectedTimer = ref(props.board.settings.timerDuration)
const customTimerValue = ref(90)
const saving = ref(false)
const error = ref('')

const decks = Object.values(DECK_CONFIGS)

const timerOptions = [
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
  { label: '120s', value: 120 },
  { label: 'Custom', value: 0 },
]

// If the current timer duration doesn't match a preset, set custom
if (!timerOptions.some(o => o.value === selectedTimer.value)) {
  customTimerValue.value = selectedTimer.value
  selectedTimer.value = 0
}

async function handleSave() {
  if (!name.value.trim()) return

  saving.value = true
  error.value = ''

  const timerDuration = selectedTimer.value === 0
    ? Math.max(10, Math.min(600, customTimerValue.value || 60))
    : selectedTimer.value

  try {
    await $fetch(`/api/boards/${props.board.code}/settings`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${props.facilitatorToken}`,
      },
      body: {
        name: name.value.trim(),
        deckType: selectedDeck.value,
        settings: {
          ...props.board.settings,
          timerDuration,
        },
      },
    })

    emit('saved')
    emit('close')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to save settings'
  } finally {
    saving.value = false
  }
}
</script>
