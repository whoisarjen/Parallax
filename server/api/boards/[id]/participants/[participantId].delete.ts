export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')
  const participantId = getRouterParam(event, 'participantId')

  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  if (!participantId) {
    throw createError({ statusCode: 400, message: 'Participant ID is required' })
  }

  const board = await validateFacilitatorToken(event, boardId)

  const supabase = useServerSupabase()

  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('id', participantId)
    .eq('board_id', board.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
