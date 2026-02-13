import type { Vote } from '~/types'

export function useVoting() {
  const myVote = ref<Vote | null>(null)

  async function submitVote(
    issueId: string,
    participantId: string,
    boardId: string,
    value: string,
  ) {
    // Optimistic: update local vote immediately so card shows selected
    const previousVote = myVote.value
    myVote.value = {
      id: crypto.randomUUID(),
      issue_id: issueId,
      participant_id: participantId,
      board_id: boardId,
      value,
      voted_at: new Date().toISOString(),
    } as Vote

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
      // Update with server response (has real ID)
      myVote.value = result as Vote
      return result as Vote
    }
    catch (e) {
      // Revert on failure
      myVote.value = previousVote
      throw e
    }
  }

  async function fetchVotesForIssue(issueId: string): Promise<Vote[]> {
    const supabase = useSupabase()
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
    submitVote,
    fetchVotesForIssue,
    clearMyVote,
  }
}
