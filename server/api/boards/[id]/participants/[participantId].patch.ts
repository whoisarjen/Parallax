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
  const body = await readBody(event)

  const validRoles = ['voter', 'spectator', 'facilitator']
  if (!body.role || !validRoles.includes(body.role)) {
    throw createError({ statusCode: 400, message: 'Invalid role. Must be voter, spectator, or facilitator' })
  }

  const supabase = useServerSupabase()

  const { data: participant, error } = await supabase
    .from('participants')
    .update({
      role: body.role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', participantId)
    .eq('board_id', board.id)
    .select()
    .single()

  if (error || !participant) {
    throw createError({ statusCode: 404, message: 'Participant not found' })
  }

  return participant
})
