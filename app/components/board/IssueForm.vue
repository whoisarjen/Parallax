<template>
  <form @submit.prevent="handleAdd" class="flex flex-col sm:flex-row gap-2">
    <!-- Title input -->
    <div class="flex-1 min-w-0">
      <input
        v-model="title"
        class="input text-sm py-2.5"
        placeholder="Issue title..."
        maxlength="200"
        required
      />
    </div>

    <!-- Jira key / URL input -->
    <div class="w-full sm:w-48">
      <input
        v-model="jiraInput"
        class="input text-sm py-2.5 font-mono"
        placeholder="PROJ-123 or Jira URL"
        maxlength="500"
        @paste="onPaste"
      />
    </div>

    <!-- Add button -->
    <button
      type="submit"
      class="btn-primary px-4 py-2.5 text-sm flex items-center justify-center gap-1.5 shrink-0"
      :disabled="!title.trim() || adding"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      {{ adding ? 'Adding...' : 'Add' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  boardId: string
}>()

const emit = defineEmits<{
  added: []
}>()

const { deviceId } = useDeviceIdentity()

const title = ref('')
const jiraInput = ref('')
const adding = ref(false)

const JIRA_URL_PATTERN = /https?:\/\/[^/]+\.atlassian\.net\/browse\/([A-Z][A-Z0-9]+-\d+)/i
const JIRA_KEY_PATTERN = /^[A-Z][A-Z0-9]+-\d+$/i

function extractJiraInfo(input: string): { key: string | null; url: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { key: null, url: null }

  const urlMatch = trimmed.match(JIRA_URL_PATTERN)
  if (urlMatch) {
    return {
      key: urlMatch[1].toUpperCase(),
      url: trimmed,
    }
  }

  if (JIRA_KEY_PATTERN.test(trimmed)) {
    return {
      key: trimmed.toUpperCase(),
      url: null,
    }
  }

  return { key: null, url: null }
}

function onPaste(event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData('text') || ''
  const urlMatch = pasted.match(JIRA_URL_PATTERN)
  if (urlMatch) {
    // Auto-extract key from pasted URL
    nextTick(() => {
      const { key } = extractJiraInfo(jiraInput.value)
      if (key && !title.value.trim()) {
        title.value = key
      }
    })
  }
}

async function handleAdd() {
  if (!title.value.trim()) return

  adding.value = true

  const { key, url } = extractJiraInfo(jiraInput.value)

  try {
    await $fetch(`/api/boards/${props.boardId}/issues`, {
      method: 'POST',
      body: {
        title: title.value.trim(),
        jiraKey: key,
        jiraUrl: url,
        deviceId: deviceId.value,
      },
    })

    title.value = ''
    jiraInput.value = ''
    emit('added')
  } catch {
    // Error handling delegated to parent via toast
  } finally {
    adding.value = false
  }
}
</script>
