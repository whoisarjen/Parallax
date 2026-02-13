<template>
  <div
    :class="[
      'group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer',
      isActive
        ? 'border-primary-500 bg-primary-500/10'
        : 'border-surface-800 bg-surface-900 hover:border-surface-700 hover:bg-surface-800/50',
    ]"
    @click="$emit('select')"
  >
    <!-- Status indicator -->
    <div class="shrink-0">
      <div
        v-if="issue.status === 'pending'"
        class="w-2.5 h-2.5 rounded-full bg-surface-600"
        title="Pending"
      />
      <div
        v-else-if="issue.status === 'voting'"
        class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse-soft"
        title="Voting"
      />
      <div
        v-else-if="issue.status === 'estimated'"
        class="w-2.5 h-2.5 rounded-full bg-emerald-400"
        title="Estimated"
      />
    </div>

    <!-- Issue content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <!-- Title -->
        <span
          class="text-sm font-medium text-surface-100 truncate"
          :title="issue.title"
        >
          {{ issue.title }}
        </span>

        <!-- Jira key badge -->
        <a
          v-if="issue.jira_key"
          :href="issue.jira_url || `#`"
          :target="issue.jira_url ? '_blank' : undefined"
          :rel="issue.jira_url ? 'noopener noreferrer' : undefined"
          class="badge-primary shrink-0 hover:bg-primary-500/30 transition-colors"
          @click.stop
        >
          {{ issue.jira_key }}
        </a>
      </div>
    </div>

    <!-- Final estimate badge -->
    <div v-if="issue.final_estimate" class="shrink-0">
      <span class="badge-success font-mono font-bold">
        {{ issue.final_estimate }}
      </span>
    </div>

    <!-- Facilitator actions (shown on hover) -->
    <div
      v-if="isFacilitator"
      class="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        class="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        title="Delete issue"
        @click.stop="$emit('delete')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '~/types'

defineProps<{
  issue: Issue
  isActive: boolean
  isFacilitator: boolean
}>()

defineEmits<{
  select: []
  delete: []
}>()
</script>
