<template>
  <section class="py-20 sm:py-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="relative rounded-3xl border border-surface-800 bg-gradient-to-b from-surface-900 to-surface-950 p-10 sm:p-14 text-center overflow-hidden"
      >
        <!-- Subtle background glow -->
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-10 blur-[80px] -z-0"
          style="background: radial-gradient(ellipse, var(--color-primary-500), transparent 70%)"
          aria-hidden="true"
        />

        <div class="relative z-10">
          <!-- Heading -->
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">
            Built in the Open
          </h2>

          <!-- Description -->
          <p class="mt-4 text-surface-400 text-lg max-w-lg mx-auto leading-relaxed">
            Parallax is free and open-source. Contribute, customize, or self-host.
          </p>

          <!-- GitHub button -->
          <div class="mt-8">
            <a
              href="https://github.com/kamilowczarek/Parallax"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary inline-flex items-center gap-2.5 text-base px-7 py-3.5"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>

          <!-- Tech stack badges -->
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <!-- Nuxt -->
            <span class="badge-neutral flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.464 3.798a2.266 2.266 0 0 0-3.928 0L.746 18.94a2.266 2.266 0 0 0 1.964 3.393h4.8a2.3 2.3 0 0 0 1.964-1.12l5.026-8.69-2.5-4.33L9.7 12.917l-2.972-5.14 4.232-7.32L13.464 3.8ZM23.254 18.94l-5.528-9.572-2.502 4.33 4.028 6.97H14.89l-1.44 2.494a.26.26 0 0 0 .225.388h7.614a2.266 2.266 0 0 0 1.964-3.393v-.217Z"/>
              </svg>
              Nuxt
            </span>

            <!-- Supabase -->
            <span class="badge-neutral flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.7 21.8c-.4.5-1.3.2-1.3-.5v-7.6h8.6c.8 0 1.2.9.7 1.5l-8 6.6ZM12.4 2.2c.4-.5 1.3-.2 1.3.5v7.6H5.1c-.8 0-1.2-.9-.7-1.5l8-6.6Z"/>
              </svg>
              Supabase
            </span>

            <!-- Tailwind CSS -->
            <span class="badge-neutral flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <svg class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.4 10.85 14.5 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.6 7.15 14.5 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.4 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.6 13.15 9.5 12 7 12Z"/>
              </svg>
              Tailwind CSS
            </span>

            <!-- Vercel -->
            <span class="badge-neutral flex items-center gap-1.5 px-3 py-1.5 text-sm">
              <svg class="w-4 h-4 text-surface-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 19.5h20L12 2Z"/>
              </svg>
              Vercel
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
