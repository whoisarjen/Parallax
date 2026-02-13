<template>
  <div class="flex flex-col items-center gap-3">
    <!-- Circular progress ring -->
    <div class="relative w-28 h-28">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <!-- Background ring -->
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          stroke-width="6"
          class="text-surface-800"
        />
        <!-- Progress ring -->
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          :stroke="ringColor"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-1000 ease-linear"
        />
      </svg>
      <!-- Center text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span
          :class="[
            'text-xl font-mono font-bold tabular-nums transition-colors duration-300',
            textColor,
          ]"
        >
          {{ timer.formattedTime.value }}
        </span>
        <span v-if="timer.isExpired.value" class="text-xs text-red-400 font-medium mt-0.5">
          Time's up
        </span>
      </div>
    </div>

    <!-- Facilitator controls -->
    <div v-if="isFacilitator" class="flex items-center gap-2">
      <button
        v-if="!timer.isRunning.value"
        class="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
        @click="handleStart"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
        Start
      </button>
      <button
        v-else
        class="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
        @click="handleStop"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
        Stop
      </button>
      <button
        class="btn-ghost px-3 py-1.5 text-sm flex items-center gap-1.5"
        @click="handleReset"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isFacilitator: boolean
}>()

const emit = defineEmits<{
  start: [seconds: number]
  stop: []
}>()

const timer = useTimer()

const radius = 42
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  return circumference * (1 - timer.progress.value)
})

const ringColor = computed(() => {
  const p = timer.progress.value
  if (p > 0.5) return 'var(--color-emerald-400, #34d399)'
  if (p > 0.2) return 'var(--color-amber-400, #fbbf24)'
  return 'var(--color-red-400, #f87171)'
})

const textColor = computed(() => {
  if (!timer.isRunning.value && !timer.isExpired.value) return 'text-surface-400'
  const p = timer.progress.value
  if (p > 0.5) return 'text-emerald-400'
  if (p > 0.2) return 'text-amber-400'
  return 'text-red-400'
})

const defaultDuration = 60

function handleStart() {
  timer.start(defaultDuration)
  emit('start', defaultDuration)
}

function handleStop() {
  timer.stop()
  emit('stop')
}

function handleReset() {
  timer.reset()
}

defineExpose({
  start: timer.start,
  stop: timer.stop,
  reset: timer.reset,
})
</script>
