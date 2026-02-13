<template>
  <section class="py-24 sm:py-32 relative overflow-hidden">
    <!-- Background glow -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.1] blur-[120px]"
        style="background: radial-gradient(ellipse, var(--color-primary-500), transparent 70%)"
      />
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
        Ready to estimate?
      </h2>
      <p class="mt-5 text-surface-400 text-lg max-w-lg mx-auto leading-relaxed">
        Create a board in seconds and get your team aligned. No sign-up, no credit card, no catch.
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          class="btn-primary text-lg px-8 py-4 flex items-center gap-2.5 shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-[1.02] transition-all duration-200"
          @click="$emit('create')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create a Board
        </button>

        <button
          class="btn-secondary text-base px-7 py-3.5 inline-flex items-center gap-2"
          @click="$emit('join')"
        >
          Join a Board
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  create: []
  join: []
}>()
</script>
