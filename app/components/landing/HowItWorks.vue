<template>
  <section class="py-20 sm:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">
          How It Works
        </h2>
        <p class="mt-4 text-surface-400 text-lg max-w-xl mx-auto">
          Get your team estimating in under a minute.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
        <!-- Connecting line (desktop only) -->
        <div
          class="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-primary-600/40 via-primary-500/60 to-primary-600/40"
          aria-hidden="true"
        />

        <!-- Step 1: Create -->
        <div class="flex flex-col items-center text-center group">
          <div class="relative">
            <span
              class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950"
            >
              1
            </span>
            <div
              class="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all duration-300"
            >
              <svg class="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-surface-100">Create</h3>
          <p class="mt-2 text-surface-400 text-sm leading-relaxed max-w-xs">
            Start a new planning poker session in seconds
          </p>
        </div>

        <!-- Step 2: Share -->
        <div class="flex flex-col items-center text-center group">
          <div class="relative">
            <span
              class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950"
            >
              2
            </span>
            <div
              class="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all duration-300"
            >
              <svg class="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-surface-100">Share</h3>
          <p class="mt-2 text-surface-400 text-sm leading-relaxed max-w-xs">
            Share the board code with your team
          </p>
        </div>

        <!-- Step 3: Estimate -->
        <div class="flex flex-col items-center text-center group">
          <div class="relative">
            <span
              class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center z-10 ring-4 ring-surface-950"
            >
              3
            </span>
            <div
              class="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all duration-300"
            >
              <svg class="w-7 h-7 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-surface-100">Estimate</h3>
          <p class="mt-2 text-surface-400 text-sm leading-relaxed max-w-xs">
            Vote together in real-time and reach consensus
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
