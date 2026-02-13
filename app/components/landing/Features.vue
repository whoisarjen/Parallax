<template>
  <section class="py-20 sm:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">
          Everything You Need
        </h2>
        <p class="mt-4 text-surface-400 text-lg max-w-xl mx-auto">
          Powerful features to make estimation sessions smooth and productive.
        </p>
      </div>

      <!-- Feature grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Real-Time Voting -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">Real-Time Voting</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            See who's voted instantly. All changes sync in real-time via WebSocket.
          </p>
        </div>

        <!-- Multiple Decks -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">Multiple Decks</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            Fibonacci, Modified Fibonacci, T-Shirt sizes, Powers of 2, or create your own.
          </p>
        </div>

        <!-- Issue Management -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">Issue Management</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            Add stories, paste Jira links, bulk import. Track estimates as you go.
          </p>
        </div>

        <!-- Spectator Mode -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">Spectator Mode</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            Stakeholders can watch without influencing estimates.
          </p>
        </div>

        <!-- Built-in Timer -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">Built-in Timer</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            Keep estimation sessions moving with configurable countdown timers.
          </p>
        </div>

        <!-- No Sign-Up Required -->
        <div class="card-hover group">
          <div
            class="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/15 transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-surface-100">No Sign-Up Required</h3>
          <p class="mt-2 text-sm text-surface-400 leading-relaxed">
            Jump right in. No accounts, no data collection, no friction.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
