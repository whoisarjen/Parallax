<template>
  <div class="overlay" @click.self="$emit('close')" />
  <div class="dialog" @click.self="$emit('close')">
    <div class="card max-w-md w-full animate-slide-up" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Join a Board</h2>
        <button @click="$emit('close')" class="btn-ghost p-1" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleJoin" class="space-y-4">
        <div>
          <label for="board-link" class="block text-sm font-medium text-surface-300 mb-1.5">
            Board Link or ID
          </label>
          <input
            id="board-link"
            v-model="boardInput"
            class="input text-sm"
            placeholder="Paste board link or UUID..."
            autofocus
            required
          />
          <p class="text-xs text-surface-500 mt-1">
            Paste the full board URL or the board ID shared with you
          </p>
        </div>

        <div>
          <label for="join-name" class="block text-sm font-medium text-surface-300 mb-1.5">
            Your Name
          </label>
          <input
            id="join-name"
            v-model="displayName"
            class="input"
            placeholder="e.g. Alex"
            maxlength="30"
            required
          />
        </div>

        <div v-if="error" class="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="joining || !isInputValid || !displayName.trim()"
        >
          {{ joining ? 'Joining...' : 'Join Board' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
  joined: [boardId: string]
}>()

const { getDisplayName } = useDeviceIdentity()

const boardInput = ref('')
const displayName = ref(getDisplayName())
const joining = ref(false)
const error = ref('')

const extractedBoardId = computed(() => extractBoardId(boardInput.value))
const isInputValid = computed(() => !!extractedBoardId.value)

async function handleJoin() {
  if (!isInputValid.value || !displayName.value.trim()) return

  joining.value = true
  error.value = ''

  emit('joined', extractedBoardId.value!)
}
</script>
