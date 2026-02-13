<template>
  <footer class="border-t border-surface-800 py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="/parallax-logo.png" alt="Parallax" class="h-6 w-6 rounded-md opacity-60" />
          <span class="text-sm text-surface-500">
            Parallax &mdash; Open-source planning poker
          </span>
        </div>

        <div class="flex items-center gap-4">
          <span class="badge-success text-xs">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Open Source
          </span>
          <a
            href="https://github.com/kamilowczarek/Parallax"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-surface-500 hover:text-surface-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      <p class="text-center text-xs text-surface-600 mt-6">
        No data collected. No accounts needed. Your sessions expire after 24 hours of inactivity.
      </p>
    </div>
  </footer>
</template>
