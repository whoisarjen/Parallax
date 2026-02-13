<template>
  <div class="overlay" @click.self="$emit('close')" />
  <div class="dialog" @click.self="$emit('close')">
    <div class="card max-w-lg w-full animate-slide-up" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Bulk Import Issues</h2>
        <button @click="$emit('close')" class="btn-ghost p-1" aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- Textarea -->
        <div>
          <label for="bulk-input" class="block text-sm font-medium text-surface-300 mb-1.5">
            Paste issues (one per line)
          </label>
          <textarea
            id="bulk-input"
            v-model="rawInput"
            class="input min-h-[160px] resize-y font-mono text-sm leading-relaxed"
            placeholder="PROJ-123 Add user authentication
PROJ-124 Fix login page layout
Refactor payment service
https://team.atlassian.net/browse/PROJ-125 Update API docs"
            @input="parseIssues"
          />
          <p class="text-xs text-surface-500 mt-1.5">
            Jira keys (PROJ-123) and URLs are automatically detected.
          </p>
        </div>

        <!-- Preview table -->
        <div v-if="parsedIssues.length > 0" class="space-y-2">
          <h3 class="text-sm font-medium text-surface-300">
            Preview ({{ parsedIssues.length }} issue{{ parsedIssues.length !== 1 ? 's' : '' }})
          </h3>
          <div class="max-h-48 overflow-y-auto rounded-xl border border-surface-800">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-surface-800">
                  <th class="text-left px-3 py-2 text-surface-400 font-medium">Title</th>
                  <th class="text-left px-3 py-2 text-surface-400 font-medium w-28">Jira Key</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(issue, idx) in parsedIssues"
                  :key="idx"
                  class="border-b border-surface-800/50 last:border-0"
                >
                  <td class="px-3 py-2 text-surface-200 truncate max-w-[280px]">
                    {{ issue.title }}
                  </td>
                  <td class="px-3 py-2">
                    <span v-if="issue.jiraKey" class="badge-primary text-xs">
                      {{ issue.jiraKey }}
                    </span>
                    <span v-else class="text-surface-600">&mdash;</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <!-- Import button -->
        <button
          class="btn-primary w-full"
          :disabled="parsedIssues.length === 0 || importing"
          @click="handleImport"
        >
          {{ importing ? 'Importing...' : `Import ${parsedIssues.length} Issue${parsedIssues.length !== 1 ? 's' : ''}` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  boardCode: string
}>()

const emit = defineEmits<{
  close: []
  imported: []
}>()

const { deviceId, getFacilitatorToken } = useDeviceIdentity()

const rawInput = ref('')
const importing = ref(false)
const error = ref('')

interface ParsedIssue {
  title: string
  jiraKey: string | null
  jiraUrl: string | null
}

const parsedIssues = ref<ParsedIssue[]>([])

const JIRA_URL_PATTERN = /https?:\/\/[^/\s]+\.atlassian\.net\/browse\/([A-Z][A-Z0-9]+-\d+)/i
const JIRA_KEY_PATTERN = /^([A-Z][A-Z0-9]+-\d+)\s+/i

function parseIssues() {
  const lines = rawInput.value
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  parsedIssues.value = lines.map((line) => {
    let title = line
    let jiraKey: string | null = null
    let jiraUrl: string | null = null

    // Try to extract Jira URL
    const urlMatch = line.match(JIRA_URL_PATTERN)
    if (urlMatch) {
      jiraKey = urlMatch[1].toUpperCase()
      jiraUrl = urlMatch[0]
      title = line.replace(urlMatch[0], '').trim() || jiraKey
    } else {
      // Try to extract Jira key from beginning
      const keyMatch = line.match(JIRA_KEY_PATTERN)
      if (keyMatch) {
        jiraKey = keyMatch[1].toUpperCase()
        title = line.slice(keyMatch[0].length).trim() || jiraKey
      } else {
        // Try to detect a standalone Jira key anywhere
        const standaloneMatch = line.match(/\b([A-Z][A-Z0-9]+-\d+)\b/i)
        if (standaloneMatch) {
          jiraKey = standaloneMatch[1].toUpperCase()
        }
      }
    }

    return { title, jiraKey, jiraUrl }
  })
}

async function handleImport() {
  if (parsedIssues.value.length === 0) return

  importing.value = true
  error.value = ''

  const facilitatorToken = getFacilitatorToken(props.boardCode)

  try {
    await $fetch(`/api/boards/${props.boardCode}/issues/bulk`, {
      method: 'POST',
      headers: facilitatorToken
        ? { Authorization: `Bearer ${facilitatorToken}` }
        : {},
      body: {
        issues: parsedIssues.value,
        deviceId: deviceId.value,
      },
    })

    emit('imported')
    emit('close')
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to import issues'
  } finally {
    importing.value = false
  }
}
</script>
