<template>
  <section class="py-24 sm:py-32 relative">
    <!-- Subtle background -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style="background: radial-gradient(ellipse, var(--color-primary-500), transparent 70%)"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center mb-16 reveal">
        <p class="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-3">Features</p>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Everything your team needs
        </h2>
        <p class="mt-4 text-surface-400 text-lg max-w-xl mx-auto">
          Powerful yet simple tools to make estimation sessions smooth and productive.
        </p>
      </div>

      <!-- Bento grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        <!-- Real-Time Voting - Large card -->
        <div class="bento-card sm:col-span-2 lg:col-span-2 p-8 reveal group">
          <div class="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div class="flex-1">
              <div
                class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5 group-hover:bg-primary-500/15 group-hover:border-primary-500/30 transition-all duration-300"
              >
                <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-surface-100">Real-Time Voting</h3>
              <p class="mt-3 text-surface-400 leading-relaxed">
                See who's voted instantly. All changes sync in real-time via WebSocket connections.
                No refreshing, no waiting.
              </p>
            </div>
            <!-- Mini illustration -->
            <div class="hidden sm:flex gap-2 items-end shrink-0 pt-4">
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-14 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/20 flex items-center justify-center text-white font-bold text-sm shadow-md">5</div>
                <div class="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-14 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/20 flex items-center justify-center text-white font-bold text-sm shadow-md">8</div>
                <div class="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-14 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center shadow-md animate-pulse-soft">
                  <span class="text-surface-500 text-xs">?</span>
                </div>
                <div class="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- No Sign-Up Required - Tall card -->
        <div class="bento-card p-8 reveal group">
          <div
            class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/15 group-hover:border-emerald-500/30 transition-all duration-300"
          >
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-100">No Sign-Up</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed">
            Jump right in. No accounts, no passwords, no friction. Share a link and start estimating.
          </p>
          <!-- Visual: quick start flow -->
          <div class="mt-6 space-y-2">
            <div class="flex items-center gap-2 text-xs">
              <span class="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold text-[10px]">1</span>
              <span class="text-surface-400">Create board</span>
              <span class="text-surface-600 ml-auto font-mono">2s</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold text-[10px]">2</span>
              <span class="text-surface-400">Share link</span>
              <span class="text-surface-600 ml-auto font-mono">3s</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-[10px]">3</span>
              <span class="text-surface-400">Start voting</span>
              <span class="text-surface-600 ml-auto font-mono">0s</span>
            </div>
          </div>
        </div>

        <!-- Multiple Decks -->
        <div class="bento-card p-8 reveal group">
          <div
            class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/15 group-hover:border-purple-500/30 transition-all duration-300"
          >
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-100">Multiple Decks</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed">
            Fibonacci, T-Shirt sizes, Powers of 2, or create your own custom deck.
          </p>
          <!-- Mini deck preview -->
          <div class="mt-5 flex gap-1.5">
            <span v-for="v in ['1', '2', '3', '5', '8']" :key="v"
              class="w-7 h-9 rounded-md bg-surface-800 border border-surface-700 text-[10px] font-semibold text-surface-400 flex items-center justify-center"
            >{{ v }}</span>
            <span class="w-7 h-9 rounded-md bg-surface-800 border border-surface-700 text-[10px] text-surface-500 flex items-center justify-center">...</span>
          </div>
        </div>

        <!-- Issue Management -->
        <div class="bento-card p-8 reveal group">
          <div
            class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5 group-hover:bg-sky-500/15 group-hover:border-sky-500/30 transition-all duration-300"
          >
            <svg class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-surface-100">Issue Management</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed">
            Add stories, paste Jira links, bulk import. Track estimates as you go.
          </p>
        </div>

        <!-- Spectator Mode + Timer - Combined wide card -->
        <div class="bento-card sm:col-span-2 lg:col-span-1 p-8 reveal group">
          <div class="flex gap-4 mb-5">
            <div
              class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/15 group-hover:border-amber-500/30 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/15 group-hover:border-rose-500/30 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-surface-100">Spectator Mode &amp; Timer</h3>
          <p class="mt-3 text-surface-400 text-sm leading-relaxed">
            Stakeholders watch without influencing. Configurable countdown keeps sessions moving.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
