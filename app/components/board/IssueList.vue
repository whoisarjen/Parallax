<template>
  <div class="flex flex-col h-full">
    <div class="px-4 py-3 border-b border-surface-800">
      <h2 class="text-sm font-semibold text-surface-300 uppercase tracking-wider">
        Issues ({{ issues.length }})
      </h2>
    </div>

    <!-- Add Issue form -->
    <div v-if="isFacilitator" class="px-3 py-3 border-b border-surface-800/50">
      <form @submit.prevent="handleAddIssue" class="space-y-2">
        <input
          v-model="newIssueTitle"
          class="input text-sm !py-2 !px-3"
          placeholder="Issue title or Jira key..."
          maxlength="200"
        />
        <div v-if="showDescription" class="space-y-2">
          <textarea
            v-model="newIssueDescription"
            class="input text-sm !py-2 !px-3 resize-none"
            placeholder="Description (optional)"
            rows="2"
            maxlength="500"
          />
        </div>
        <div class="flex items-center gap-2">
          <button
            type="submit"
            class="btn-primary text-xs !px-3 !py-1.5 !rounded-lg"
            :disabled="!newIssueTitle.trim() || addingIssue"
          >
            {{ addingIssue ? 'Adding...' : 'Add' }}
          </button>
          <button
            type="button"
            @click="showDescription = !showDescription"
            class="text-xs text-surface-500 hover:text-surface-300 transition-colors"
          >
            {{ showDescription ? 'Hide details' : '+ Details' }}
          </button>
        </div>
        <div v-if="addError" class="text-xs text-red-400">{{ addError }}</div>
      </form>
    </div>

    <!-- Issue list -->
    <div class="flex-1 overflow-y-auto p-3 space-y-1">
      <button
        v-for="issue in issues"
        :key="issue.id"
        @click="handleIssueClick(issue)"
        class="w-full text-left px-3 py-3 rounded-xl transition-all duration-150 group"
        :class="issueClasses(issue)"
      >
        <div class="flex items-start gap-2.5">
          <!-- Status icon -->
          <div class="shrink-0 mt-0.5">
            <div
              v-if="issue.status === 'estimated'"
              class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
            >
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div
              v-else-if="issue.status === 'voting'"
              class="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center animate-pulse-soft"
            >
              <div class="w-2.5 h-2.5 rounded-full bg-primary-400" />
            </div>
            <div
              v-else
              class="w-6 h-6 rounded-full bg-surface-700/50 flex items-center justify-center"
            >
              <div class="w-2 h-2 rounded-full bg-surface-500" />
            </div>
          </div>

          <!-- Issue content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                v-if="issue.jira_key"
                class="text-[10px] font-mono font-semibold text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded shrink-0"
              >
                {{ issue.jira_key }}
              </span>
              <span class="text-sm text-surface-200 truncate group-hover:text-surface-100">
                {{ issue.title }}
              </span>
            </div>
            <div v-if="issue.description" class="text-xs text-surface-500 mt-0.5 line-clamp-1">
              {{ issue.description }}
            </div>
          </div>

          <!-- Estimate badge -->
          <div class="shrink-0">
            <span
              v-if="issue.final_estimate"
              class="badge-success text-xs font-mono font-bold"
            >
              {{ issue.final_estimate }}
            </span>
            <span
              v-else-if="issue.status === 'voting'"
              class="badge-primary text-[10px]"
            >
              voting
            </span>
          </div>

          <!-- Delete button (facilitator) -->
          <button
            v-if="isFacilitator && issue.status !== 'voting'"
            @click.stop="handleDeleteIssue(issue.id)"
            class="shrink-0 p-1 rounded-lg text-surface-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
            aria-label="Delete issue"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </button>

      <div
        v-if="issues.length === 0"
        class="text-center py-8 text-surface-500 text-sm"
      >
        {{ isFacilitator ? 'Add an issue above to get started' : 'No issues added yet' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '~/types'

const props = defineProps<{
  issues: Issue[]
  currentIssueId: string | null
  isFacilitator: boolean
  boardId: string
}>()

const emit = defineEmits<{
  startVoting: [issueId: string]
  issueAdded: []
  issueDeleted: []
}>()

const { parseJiraInput, addIssue, deleteIssue } = useIssues(props.boardId)

const newIssueTitle = ref('')
const newIssueDescription = ref('')
const showDescription = ref(false)
const addingIssue = ref(false)
const addError = ref('')

function issueClasses(issue: Issue): string {
  if (issue.id === props.currentIssueId) {
    return 'bg-primary-500/10 border border-primary-500/30 ring-1 ring-primary-500/20'
  }
  if (issue.status === 'estimated') {
    return 'bg-surface-800/30 hover:bg-surface-800/50 border border-transparent'
  }
  return 'hover:bg-surface-800/50 border border-transparent'
}

async function handleAddIssue() {
  if (!newIssueTitle.value.trim()) return

  addingIssue.value = true
  addError.value = ''

  try {
    // Check if input is a Jira key/URL
    const parsed = parseJiraInput(newIssueTitle.value.trim())
    const title = parsed.key || newIssueTitle.value.trim()

    await addIssue(
      title,
      newIssueDescription.value.trim() || undefined,
      parsed.key || undefined,
      parsed.url || undefined,
    )

    newIssueTitle.value = ''
    newIssueDescription.value = ''
    showDescription.value = false
    emit('issueAdded')
  }
  catch (e: any) {
    addError.value = e.data?.message || 'Failed to add issue'
  }
  finally {
    addingIssue.value = false
  }
}

function handleIssueClick(issue: Issue) {
  if (!props.isFacilitator) return
  if (issue.status === 'estimated') return
  emit('startVoting', issue.id)
}

async function handleDeleteIssue(issueId: string) {
  try {
    await deleteIssue(issueId)
    emit('issueDeleted')
  }
  catch (e: any) {
    console.error('Failed to delete issue:', e)
  }
}
</script>
