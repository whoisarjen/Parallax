export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  const board = await validateFacilitatorToken(event, code)

  const supabase = useServerSupabase()

  // Reset any voting issues back to pending
  await supabase
    .from('issues')
    .update({ status: 'pending', updated_at: new Date().toISOString() })
    .eq('board_id', board.id)
    .eq('status', 'voting')

  // Set board back to idle (do NOT delete votes - preserved for history)
  const { error: boardError } = await supabase
    .from('boards')
    .update({
      voting_state: 'idle',
      current_issue_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', board.id)

  if (boardError) {
    throw createError({ statusCode: 500, message: boardError.message })
  }

  return { success: true }
})
