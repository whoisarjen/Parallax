<template>
  <button
    :class="[
      'vote-card relative rounded-xl border-2 transition-all duration-200 font-bold select-none',
      'w-16 h-24 sm:w-20 sm:h-28 text-lg sm:text-xl',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950',
      cardClasses,
    ]"
    :disabled="disabled"
    :style="{ perspective: '600px' }"
    @click="handleClick"
  >
    <div
      class="vote-card-inner relative w-full h-full transition-transform duration-500"
      :class="{ 'vote-card-flipped': isFlipped }"
      :style="{ transformStyle: 'preserve-3d' }"
    >
      <!-- Front face (card back / face-down) -->
      <div
        class="vote-card-face absolute inset-0 rounded-xl flex items-center justify-center"
        :style="{ backfaceVisibility: 'hidden' }"
      >
        <div v-if="faceDown" class="w-full h-full rounded-[10px] bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
          <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-md border-2 border-primary-400/30 bg-primary-700/50 flex items-center justify-center">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <span v-else class="text-center leading-tight">{{ value }}</span>
      </div>

      <!-- Back face (revealed value) -->
      <div
        class="vote-card-face vote-card-back absolute inset-0 rounded-xl flex items-center justify-center bg-surface-800"
        :style="{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }"
      >
        <span class="text-center leading-tight text-surface-100 font-bold">
          {{ revealedValue || value }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  selected?: boolean
  disabled?: boolean
  revealed?: boolean
  faceDown?: boolean
  revealedValue?: string
}>()

const emit = defineEmits<{
  click: [value: string]
}>()

const isFlipped = computed(() => {
  return props.revealed && props.faceDown
})

const cardClasses = computed(() => {
  if (props.faceDown && !props.revealed) {
    return 'border-primary-600/50 bg-primary-900/30 cursor-default'
  }

  if (props.disabled) {
    return 'border-surface-700 bg-surface-800/50 text-surface-600 cursor-not-allowed opacity-50'
  }

  if (props.selected) {
    return 'border-primary-500 bg-primary-500/20 text-primary-200 scale-105 shadow-lg shadow-primary-500/20 cursor-pointer'
  }

  return 'border-surface-700 bg-surface-800 text-surface-200 hover:border-surface-500 hover:bg-surface-700 hover:scale-[1.03] cursor-pointer active:scale-[0.97]'
})

function handleClick() {
  if (!props.disabled && !props.faceDown) {
    emit('click', props.value)
  }
}
</script>

<style scoped>
.vote-card-flipped {
  transform: rotateY(180deg);
}
</style>
