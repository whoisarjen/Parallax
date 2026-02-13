import type { Participant, ParticipantRole } from '~/types'

export function useParticipants(boardId: string) {
  const supabase = useSupabase()

  async function fetchParticipants(boardDbId: string): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('board_id', boardDbId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch participants:', error.message)
      return []
    }

    return (data || []) as Participant[]
  }

  async function updateRole(
    participantId: string,
    role: ParticipantRole,
    token: string,
  ) {
    return await $fetch(`/api/boards/${boardId}/participants/${participantId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: { role },
    })
  }

  async function removeParticipant(
    participantId: string,
    token: string,
  ) {
    return await $fetch(`/api/boards/${boardId}/participants/${participantId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return {
    fetchParticipants,
    updateRole,
    removeParticipant,
  }
}
