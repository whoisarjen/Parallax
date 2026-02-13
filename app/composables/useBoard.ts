import type { Board, Participant, Issue } from '~/types'

export function useBoard(boardId: string) {
  const board = ref<Board | null>(null)
  const participants = ref<Participant[]>([])
  const issues = ref<Issue[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const errorStatus = ref<number | null>(null)

  // Initial load only - after this, all updates come through WebSocket
  async function fetchBoard() {
    loading.value = true
    error.value = null
    errorStatus.value = null

    try {
      const data: any = await $fetch(`/api/boards/${boardId}`)
      board.value = data as Board
      participants.value = data.participants || []
      issues.value = (data.issues || []).sort(
        (a: Issue, b: Issue) => a.sort_order - b.sort_order,
      )
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Failed to load board'
      errorStatus.value = e.statusCode || e.status || 500
    } finally {
      loading.value = false
    }
  }

  return {
    board,
    participants,
    issues,
    loading,
    error,
    errorStatus,
    fetchBoard,
  }
}
