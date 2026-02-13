import type { Issue } from '~/types'

interface ParsedJiraInput {
  key: string | null
  url: string | null
}

export function useIssues(boardId: string) {
  function parseJiraInput(input: string): ParsedJiraInput {
    const trimmed = input.trim()
    if (!trimmed) return { key: null, url: null }

    // Try to parse as URL first
    // Matches patterns like: https://company.atlassian.net/browse/PROJ-123
    const urlMatch = trimmed.match(
      /^(https?:\/\/[^/]+\/browse\/([A-Z][A-Z0-9]+-\d+))/i,
    )
    if (urlMatch) {
      return {
        key: urlMatch[2].toUpperCase(),
        url: urlMatch[1],
      }
    }

    // Try URL pattern: https://company.atlassian.net/jira/software/.../board/.../PROJ-123
    const altUrlMatch = trimmed.match(
      /^(https?:\/\/[^/]+\/.*?([A-Z][A-Z0-9]+-\d+))/i,
    )
    if (altUrlMatch && trimmed.startsWith('http')) {
      return {
        key: altUrlMatch[2].toUpperCase(),
        url: trimmed,
      }
    }

    // Try as plain Jira key: PROJ-123
    const keyMatch = trimmed.match(/^([A-Z][A-Z0-9]+-\d+)$/i)
    if (keyMatch) {
      return {
        key: keyMatch[1].toUpperCase(),
        url: null,
      }
    }

    return { key: null, url: null }
  }

  async function addIssue(
    title: string,
    description?: string,
    jiraKey?: string,
    jiraUrl?: string,
  ): Promise<Issue> {
    const { getFacilitatorToken } = useDeviceIdentity()
    const token = getFacilitatorToken(boardId)

    const result = await $fetch(`/api/boards/${boardId}/issues`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: {
        title: title.trim(),
        description: description?.trim() || null,
        jiraKey: jiraKey || null,
        jiraUrl: jiraUrl || null,
      },
    })

    return result as Issue
  }

  async function deleteIssue(issueId: string) {
    const { getFacilitatorToken } = useDeviceIdentity()
    const token = getFacilitatorToken(boardId)

    return await $fetch(`/api/boards/${boardId}/issues/${issueId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  }

  async function reorderIssues(orderedIds: string[]) {
    const { getFacilitatorToken } = useDeviceIdentity()
    const token = getFacilitatorToken(boardId)

    return await $fetch(`/api/boards/${boardId}/issues/reorder`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: { orderedIds },
    })
  }

  return {
    parseJiraInput,
    addIssue,
    deleteIssue,
    reorderIssues,
  }
}
