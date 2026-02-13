<template>
  <div class="space-y-5 animate-fade-in">
    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-surface-800/50 rounded-xl px-4 py-3 text-center">
        <div class="text-xs text-surface-500 uppercase tracking-wider mb-1">Average</div>
        <div class="text-xl font-bold text-surface-100">
          {{ stats.average !== null ? stats.average : '--' }}
        </div>
      </div>
      <div class="bg-surface-800/50 rounded-xl px-4 py-3 text-center">
        <div class="text-xs text-surface-500 uppercase tracking-wider mb-1">Median</div>
        <div class="text-xl font-bold text-surface-100">
          {{ stats.median !== null ? stats.median : '--' }}
        </div>
      </div>
      <div class="bg-surface-800/50 rounded-xl px-4 py-3 text-center">
        <div class="text-xs text-surface-500 uppercase tracking-wider mb-1">Mode</div>
        <div class="text-xl font-bold text-surface-100">
          {{ stats.mode.length > 0 ? stats.mode.join(', ') : '--' }}
        </div>
      </div>
      <div class="bg-surface-800/50 rounded-xl px-4 py-3 text-center">
        <div class="text-xs text-surface-500 uppercase tracking-wider mb-1">Agreement</div>
        <div class="text-xl font-bold" :class="agreementColor">
          {{ stats.agreement }}%
        </div>
      </div>
    </div>

    <!-- Distribution bars -->
    <div v-if="sortedDistribution.length > 0" class="space-y-2">
      <div class="text-xs text-surface-500 uppercase tracking-wider font-semibold">Distribution</div>
      <div class="space-y-2">
        <div
          v-for="item in sortedDistribution"
          :key="item.value"
          class="flex items-center gap-3"
        >
          <div class="w-10 text-right text-sm font-mono font-bold text-surface-300">
            {{ item.value }}
          </div>
          <div class="flex-1 h-7 bg-surface-800 rounded-lg overflow-hidden relative">
            <div
              class="h-full rounded-lg transition-all duration-500 ease-out"
              :class="item.value === stats.mode[0] ? 'bg-primary-500' : 'bg-surface-600'"
              :style="{ width: `${item.percentage}%` }"
            />
            <div class="absolute inset-0 flex items-center px-2">
              <span
                v-if="item.percentage > 20"
                class="text-xs font-medium text-white"
              >
                {{ item.count }} vote{{ item.count !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>
          <div class="w-10 text-xs text-surface-500">
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>

    <!-- Save Estimate (facilitator) -->
    <div v-if="isFacilitator" class="border-t border-surface-800 pt-4">
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <label for="estimate-input" class="sr-only">Final estimate</label>
          <input
            id="estimate-input"
            v-model="estimateInput"
            class="input text-center font-bold text-lg"
            placeholder="Final estimate"
            maxlength="10"
            @keydown.enter="saveEstimate"
          />
        </div>
        <button
          @click="saveEstimate"
          class="btn-primary whitespace-nowrap"
          :disabled="!estimateInput.trim() || saving"
        >
          {{ saving ? 'Saving...' : 'Save Estimate' }}
        </button>
      </div>

      <!-- Quick-select from mode values -->
      <div v-if="stats.mode.length > 0" class="flex items-center gap-2 mt-2">
        <span class="text-xs text-surface-500">Quick select:</span>
        <button
          v-for="m in stats.mode"
          :key="m"
          @click="estimateInput = m"
          class="px-2.5 py-1 rounded-lg bg-surface-800 border border-surface-700 text-sm font-mono font-bold text-surface-300 hover:border-primary-500 hover:text-primary-300 transition-colors"
        >
          {{ m }}
        </button>
        <button
          v-if="stats.average !== null"
          @click="estimateInput = String(stats.average)"
          class="px-2.5 py-1 rounded-lg bg-surface-800 border border-surface-700 text-sm font-mono font-bold text-surface-300 hover:border-primary-500 hover:text-primary-300 transition-colors"
        >
          avg: {{ stats.average }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Vote } from '~/types'
import { calculateVoteStats } from '~/utils/vote-stats'

const props = defineProps<{
  votes: Vote[]
  isFacilitator: boolean
}>()

const emit = defineEmits<{
  saveEstimate: [value: string]
}>()

const estimateInput = ref('')
const saving = ref(false)

const stats = computed(() => calculateVoteStats(props.votes))

const agreementColor = computed(() => {
  const a = stats.value.agreement
  if (a >= 80) return 'text-emerald-400'
  if (a >= 50) return 'text-amber-400'
  return 'text-red-400'
})

const sortedDistribution = computed(() => {
  return Object.entries(stats.value.distribution)
    .map(([value, count]) => ({
      value,
      count,
      percentage: Math.round((count / stats.value.totalVotes) * 100),
    }))
    .sort((a, b) => b.count - a.count)
})

async function saveEstimate() {
  if (!estimateInput.value.trim()) return
  saving.value = true
  try {
    emit('saveEstimate', estimateInput.value.trim())
  }
  finally {
    saving.value = false
  }
}

// Auto-fill estimate with mode value
watch(() => props.votes, () => {
  const s = calculateVoteStats(props.votes)
  if (s.mode.length === 1) {
    estimateInput.value = s.mode[0]
  }
}, { immediate: true })
</script>
