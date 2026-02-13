<template>
  <section class="relative overflow-hidden">
    <!-- Background gradient mesh -->
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style="background: radial-gradient(ellipse, var(--color-primary-600), transparent 70%)"
      />
      <div
        class="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
        style="background: radial-gradient(ellipse, var(--color-primary-400), transparent 70%)"
      />
      <div
        class="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
        style="background: radial-gradient(ellipse, var(--color-primary-500), transparent 70%)"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div class="text-center max-w-3xl mx-auto">
        <!-- Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight animate-slide-up">
          Planning Poker,
          <span
            class="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent"
          >
            Simplified
          </span>
        </h1>

        <!-- Subheading -->
        <p
          class="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed animate-fade-in"
        >
          Estimate stories in real-time with your team. No sign-up required.
        </p>

        <!-- CTAs -->
        <div
          class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
        >
          <!-- Create Board button -->
          <button
            class="btn-primary text-lg px-8 py-4 flex items-center gap-2.5 shadow-lg shadow-primary-600/20"
            @click="$emit('create')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create a Board
          </button>

          <!-- Quick join -->
          <form
            class="flex items-stretch rounded-xl overflow-hidden border border-surface-700 bg-surface-800/80 backdrop-blur-sm shadow-lg shadow-black/10"
            @submit.prevent="handleJoin"
          >
            <input
              v-model="joinCodeDisplay"
              type="text"
              placeholder="ABCD-1234"
              maxlength="9"
              aria-label="Board code"
              class="bg-transparent px-4 py-4 text-surface-100 placeholder-surface-500 font-mono text-lg tracking-wider uppercase w-40 sm:w-44 focus:outline-none"
              @input="onCodeInput"
            />
            <button
              type="submit"
              :disabled="!isCodeValid"
              class="btn-primary rounded-none px-6 py-4 text-base border-0 disabled:opacity-40"
            >
              Join
            </button>
          </form>
        </div>

        <!-- Subtle footer text -->
        <p class="mt-8 text-sm text-surface-600 animate-fade-in">
          Free and open-source. Sessions expire after 24h.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  create: []
  join: [code: string]
}>()

const joinCodeDisplay = ref('')

const isCodeValid = computed(() => {
  const raw = joinCodeDisplay.value.replace(/[^A-Z0-9]/gi, '')
  return raw.length === 8
})

function onCodeInput(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = input.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  if (raw.length > 4) {
    joinCodeDisplay.value = raw.slice(0, 4) + '-' + raw.slice(4, 8)
  } else {
    joinCodeDisplay.value = raw
  }
}

function handleJoin() {
  if (!isCodeValid.value) return
  const raw = joinCodeDisplay.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  const code = raw.slice(0, 4) + '-' + raw.slice(4, 8)
  emit('join', code)
}
</script>
