<template>
  <section class="relative overflow-hidden">
    <!-- Animated background gradient blobs -->
    <div class="absolute inset-0 -z-10" aria-hidden="true">
      <div
        class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full animate-glow-pulse blur-[140px]"
        style="background: radial-gradient(ellipse, var(--color-primary-600), transparent 70%)"
      />
      <div
        class="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full animate-glow-pulse blur-[120px]"
        style="background: radial-gradient(ellipse, var(--color-primary-400), transparent 70%); animation-delay: 2s"
      />
      <div
        class="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full animate-glow-pulse blur-[100px]"
        style="background: radial-gradient(ellipse, #7c3aed, transparent 70%); animation-delay: 1s"
      />
      <!-- Subtle grid pattern -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: radial-gradient(circle at 1px 1px, var(--color-surface-400) 1px, transparent 0); background-size: 40px 40px"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
      <div class="text-center max-w-4xl mx-auto">
        <!-- Announcement pill -->
        <div class="inline-flex items-center gap-2 rounded-full bg-surface-800/60 border border-surface-700/50 backdrop-blur-sm px-4 py-1.5 mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span class="text-sm text-surface-300">100% free &amp; open-source</span>
        </div>

        <!-- Heading -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-slide-up">
          Planning Poker,
          <br class="hidden sm:block" />
          <span
            class="bg-gradient-to-r from-primary-400 via-purple-400 to-primary-300 bg-clip-text text-transparent"
          >
            Simplified
          </span>
        </h1>

        <!-- Subheading -->
        <p
          class="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style="animation-delay: 0.15s"
        >
          The fastest way to estimate stories with your team.
          Real-time voting, instant results, zero friction.
        </p>

        <!-- Trust signals -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 animate-fade-in" style="animation-delay: 0.25s">
          <span class="flex items-center gap-2 text-sm text-surface-400">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            No sign-up required
          </span>
          <span class="flex items-center gap-2 text-sm text-surface-400">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Free forever
          </span>
          <span class="flex items-center gap-2 text-sm text-surface-400">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Open source
          </span>
        </div>

        <!-- CTAs -->
        <div
          class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style="animation-delay: 0.35s"
        >
          <button
            class="btn-primary text-lg px-8 py-4 flex items-center gap-2.5 shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:scale-[1.02] transition-all duration-200"
            @click="$emit('create')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create a Board
          </button>

          <form
            class="flex items-stretch rounded-xl overflow-hidden border border-surface-700/50 bg-surface-800/60 backdrop-blur-sm shadow-lg shadow-black/10"
            @submit.prevent="handleJoin"
          >
            <input
              v-model="joinCodeDisplay"
              type="text"
              placeholder="ABCD-1234"
              maxlength="9"
              aria-label="Board code"
              class="bg-transparent px-4 py-4 text-surface-100 placeholder-surface-500 font-mono text-lg tracking-wider uppercase w-40 sm:w-44 focus:outline-none"
              @input="onCodeInput"
            />
            <button
              type="submit"
              :disabled="!isCodeValid"
              class="bg-surface-700 hover:bg-surface-600 text-surface-100 font-semibold px-6 py-4 text-base transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <!-- Product mockup / visual proof -->
      <div
        class="mt-20 relative max-w-5xl mx-auto animate-fade-in-up"
        style="animation-delay: 0.5s"
      >
        <!-- Glow behind mockup -->
        <div class="absolute -inset-4 bg-gradient-to-t from-primary-600/10 via-primary-500/5 to-transparent rounded-3xl blur-2xl" aria-hidden="true" />

        <!-- Browser chrome mockup -->
        <div class="relative rounded-2xl border border-surface-700/50 bg-surface-900/80 backdrop-blur-sm shadow-2xl shadow-black/30 overflow-hidden">
          <!-- Title bar -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-surface-800 bg-surface-900/90">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-surface-700" />
              <div class="w-3 h-3 rounded-full bg-surface-700" />
              <div class="w-3 h-3 rounded-full bg-surface-700" />
            </div>
            <div class="flex-1 flex justify-center">
              <div class="bg-surface-800 rounded-md px-4 py-1 text-xs text-surface-500 font-mono">
                parallax.app/board/ABCD-1234
              </div>
            </div>
            <div class="w-[54px]" />
          </div>

          <!-- Board preview content -->
          <div class="p-6 sm:p-8 grid grid-cols-12 gap-4 min-h-[280px] sm:min-h-[340px]">
            <!-- Issue list sidebar -->
            <div class="col-span-3 space-y-2 hidden sm:block">
              <div class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Issues</div>
              <div class="rounded-lg bg-surface-800 border border-primary-500/30 p-2.5">
                <div class="text-xs font-medium text-surface-200">User auth flow</div>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-500/20 text-primary-300">voting</span>
                </div>
              </div>
              <div class="rounded-lg bg-surface-800/60 p-2.5">
                <div class="text-xs font-medium text-surface-400">API endpoints</div>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-700 text-surface-400">pending</span>
                </div>
              </div>
              <div class="rounded-lg bg-surface-800/60 p-2.5">
                <div class="text-xs font-medium text-surface-400">DB migration</div>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">5 pts</span>
                </div>
              </div>
            </div>

            <!-- Voting area center -->
            <div class="col-span-12 sm:col-span-6 flex flex-col items-center justify-center">
              <div class="text-xs text-surface-500 mb-4">Voting on: User auth flow</div>
              <!-- Face-down cards arranged in arc -->
              <div class="flex items-end gap-2 sm:gap-3 mb-6">
                <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/30 shadow-lg -rotate-6 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/30 shadow-lg -rotate-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 border border-emerald-500/30 shadow-lg rotate-0 flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/30 shadow-lg rotate-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div class="w-10 h-14 sm:w-12 sm:h-16 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 border border-primary-500/30 shadow-lg rotate-6 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
              </div>
              <div class="text-xs text-surface-500">4 of 5 voted</div>
              <!-- Card deck at bottom -->
              <div class="flex gap-1.5 mt-4">
                <div v-for="v in ['1','2','3','5','8','13','21']" :key="v"
                  class="w-8 h-11 sm:w-9 sm:h-12 rounded-md border text-xs font-semibold flex items-center justify-center transition-all"
                  :class="v === '5' ? 'bg-primary-600 border-primary-500 text-white scale-105' : 'bg-surface-800 border-surface-700 text-surface-400 hover:border-surface-600'"
                >
                  {{ v }}
                </div>
              </div>
            </div>

            <!-- Participants sidebar -->
            <div class="col-span-3 space-y-2 hidden sm:block">
              <div class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Team</div>
              <div v-for="(p, i) in mockParticipants" :key="i" class="flex items-center gap-2 py-1.5">
                <span class="relative">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold" :class="p.color">
                    {{ p.name[0] }}
                  </span>
                  <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-900" :class="p.online ? 'bg-emerald-400' : 'bg-surface-600'" />
                </span>
                <span class="text-xs" :class="p.online ? 'text-surface-200' : 'text-surface-500'">{{ p.name }}</span>
                <svg v-if="p.voted" class="w-3 h-3 text-emerald-400 ml-auto" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Gradient fade at bottom -->
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-950 to-transparent pointer-events-none" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  create: []
  join: [code: string]
}>()

const joinCodeDisplay = ref('')

const mockParticipants = [
  { name: 'Sarah', color: 'bg-primary-500/30 text-primary-300', online: true, voted: true },
  { name: 'Mike', color: 'bg-emerald-500/30 text-emerald-300', online: true, voted: true },
  { name: 'Alex', color: 'bg-amber-500/30 text-amber-300', online: true, voted: true },
  { name: 'Jordan', color: 'bg-pink-500/30 text-pink-300', online: true, voted: true },
  { name: 'Chris', color: 'bg-sky-500/30 text-sky-300', online: true, voted: false },
]

const isCodeValid = computed(() => {
  const raw = joinCodeDisplay.value.replace(/[^A-Z0-9]/gi, '')
  return raw.length === 8
})

function onCodeInput(event: Event) {
  const input = event.target as HTMLInputElement
  const raw = input.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  if (raw.length > 4) {
    joinCodeDisplay.value = raw.slice(0, 4) + '-' + raw.slice(4, 8)
  } else {
    joinCodeDisplay.value = raw
  }
}

function handleJoin() {
  if (!isCodeValid.value) return
  const raw = joinCodeDisplay.value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  const code = raw.slice(0, 4) + '-' + raw.slice(4, 8)
  emit('join', code)
}
</script>
