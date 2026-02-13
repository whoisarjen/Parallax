<template>
  <section class="py-24 sm:py-32 relative overflow-hidden">
    <!-- Background accent -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-surface-800 to-transparent" />
      <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-surface-800 to-transparent" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center mb-20 reveal">
        <p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">How it works</p>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Up and running in seconds
        </h2>
        <p class="mt-4 text-surface-400 text-lg max-w-xl mx-auto">
          No setup, no configuration. Get your team estimating in under a minute.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16 max-w-4xl mx-auto stagger">
        <!-- Connecting line (desktop only) -->
        <div
          class="hidden md:block absolute top-[52px] left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px"
          aria-hidden="true"
        >
          <div class="w-full h-full bg-gradient-to-r from-primary-500/30 via-primary-500/50 to-primary-500/30" />
          <!-- Animated dots on line -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-400 animate-[slide-across_3s_linear_infinite]" />
          </div>
        </div>

        <!-- Step 1: Create -->
        <div class="flex flex-col items-center text-center group reveal">
          <div class="relative mb-6">
            <!-- Outer ring -->
            <div class="absolute inset-0 rounded-2xl bg-primary-500/10 scale-[1.15] group-hover:scale-[1.25] transition-transform duration-500" />
            <div
              class="relative w-20 h-20 rounded-2xl bg-surface-900 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/40 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-primary-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <!-- Step number -->
            <span
              class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950 shadow-lg shadow-primary-600/20"
            >
              1
            </span>
          </div>
          <h3 class="text-xl font-semibold text-surface-100">Create</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed max-w-[240px]">
            Start a new planning poker session. Name it, pick a deck, you're set.
          </p>
        </div>

        <!-- Step 2: Share -->
        <div class="flex flex-col items-center text-center group reveal">
          <div class="relative mb-6">
            <div class="absolute inset-0 rounded-2xl bg-primary-500/10 scale-[1.15] group-hover:scale-[1.25] transition-transform duration-500" />
            <div
              class="relative w-20 h-20 rounded-2xl bg-surface-900 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/40 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-primary-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
            <span
              class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950 shadow-lg shadow-primary-600/20"
            >
              2
            </span>
          </div>
          <h3 class="text-xl font-semibold text-surface-100">Share</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed max-w-[240px]">
            Share a simple 4+4 code with your team. They join instantly.
          </p>
        </div>

        <!-- Step 3: Estimate -->
        <div class="flex flex-col items-center text-center group reveal">
          <div class="relative mb-6">
            <div class="absolute inset-0 rounded-2xl bg-primary-500/10 scale-[1.15] group-hover:scale-[1.25] transition-transform duration-500" />
            <div
              class="relative w-20 h-20 rounded-2xl bg-surface-900 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/40 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-primary-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span
              class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950 shadow-lg shadow-primary-600/20"
            >
              3
            </span>
          </div>
          <h3 class="text-xl font-semibold text-surface-100">Estimate</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed max-w-[240px]">
            Vote together in real-time. Reveal, discuss, reach consensus.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes slide-across {
  0% { left: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
</style>
