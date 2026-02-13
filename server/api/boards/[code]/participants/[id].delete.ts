export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  const participantId = getRouterParam(event, 'id')

  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  if (!participantId) {
    throw createError({ statusCode: 400, message: 'Participant ID is required' })
  }

  const board = await validateFacilitatorToken(event, code)

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
