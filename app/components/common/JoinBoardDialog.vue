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
          <label for="board-code" class="block text-sm font-medium text-surface-300 mb-1.5">
            Board Code
          </label>
          <input
            id="board-code"
            v-model="boardCodeDisplay"
            @input="onCodeInput"
            class="input font-mono text-lg tracking-wider text-center uppercase"
            placeholder="ABCD-1234"
            maxlength="9"
            autofocus
            required
          />
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
          :disabled="joining || !isCodeValid || !displayName.trim()"
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
  joined: [code: string]
}>()

const { getDisplayName } = useDeviceIdentity()

const boardCodeDisplay = ref('')
const displayName = ref(getDisplayName())
const joining = ref(false)
const error = ref('')

const isCodeValid = computed(() => isValidBoardCode(boardCodeDisplay.value))

function onCodeInput(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = input.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  boardCodeDisplay.value = formatBoardCode(raw)
}

async function handleJoin() {
  if (!isCodeValid.value || !displayName.value.trim()) return

  joining.value = true
  error.value = ''

  const normalized = normalizeBoardCode(boardCodeDisplay.value)
  const code = normalized.slice(0, 4) + '-' + normalized.slice(4)

  emit('joined', code)
}
</script>
