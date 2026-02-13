import type { Vote } from '~/types'

export function useVoting() {
  const supabase = useSupabase()

  const myVote = ref<Vote | null>(null)
  const submitting = ref(false)

  async function submitVote(
    issueId: string,
    participantId: string,
    boardId: string,
    value: string,
  ) {
    submitting.value = true
    try {
      const { deviceId } = useDeviceIdentity()
      const result = await $fetch(`/api/boards/${boardId}/vote`, {
        method: 'POST',
        body: {
          issueId,
          participantId,
          value,
          deviceId: deviceId.value,
        },
      })
      myVote.value = result as Vote
      return result as Vote
    }
    finally {
      submitting.value = false
    }
  }

  async function fetchVotesForIssue(issueId: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('issue_id', issueId)

    if (error) {
      console.error('Failed to fetch votes:', error.message)
      return []
    }

    return (data || []) as Vote[]
  }

  function clearMyVote() {
    myVote.value = null
  }

  return {
    myVote,
    submitting: readonly(submitting),
    submitVote,
    fetchVotesForIssue,
    clearMyVote,
  }
}
