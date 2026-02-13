<template>
  <footer class="border-t border-surface-800 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main footer content -->
      <div class="py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <!-- Brand column -->
        <div class="col-span-2 sm:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4">
            <img src="/parallax-logo.png" alt="Parallax" class="h-9 w-9" />
            <span class="text-lg font-bold text-surface-100">Parallax</span>
          </NuxtLink>
          <p class="text-sm text-surface-500 leading-relaxed max-w-60">
            Free, open-source planning poker for agile teams. No sign-up required.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="text-sm font-semibold text-surface-200 mb-4">Product</h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-sm text-surface-500 hover:text-surface-300 transition-colors">
                Create Board
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/my-boards" class="text-sm text-surface-500 hover:text-surface-300 transition-colors">
                My Boards
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-sm font-semibold text-surface-200 mb-4">Resources</h4>
          <ul class="space-y-3">
            <li>
              <a
                href="https://github.com/whoisarjen/Parallax"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-surface-500 hover:text-surface-300 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/whoisarjen/Parallax/issues"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-surface-500 hover:text-surface-300 transition-colors"
              >
                Report a Bug
              </a>
            </li>
            <li>
              <a
                href="https://github.com/whoisarjen/Parallax/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-surface-500 hover:text-surface-300 transition-colors"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h4 class="text-sm font-semibold text-surface-200 mb-4">Info</h4>
          <ul class="space-y-3">
            <li>
              <span class="text-sm text-surface-500">
                MIT License
              </span>
            </li>
            <li>
              <span class="flex items-center gap-1.5 text-sm text-surface-500">
                <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                All systems operational
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="py-6 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-surface-600">
          No data collected. Sessions expire after {{ expiryLabel }} of inactivity.
        </p>
        <p class="text-xs text-surface-600">
          &copy; {{ new Date().getFullYear() }} Parallax. Open source under MIT.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BOARD_EXPIRY_LABEL } from '~~/shared/constants'

const expiryLabel = BOARD_EXPIRY_LABEL
</script>
