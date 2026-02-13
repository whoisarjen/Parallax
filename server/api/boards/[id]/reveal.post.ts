export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')
  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const board = await validateFacilitatorToken(event, boardId)

  const supabase = useServerSupabase()

  // Get current issue
  const { data: boardData } = await supabase
    .from('boards')
    .select('current_issue_id')
    .eq('id', board.id)
    .single()

  if (!boardData?.current_issue_id) {
    throw createError({ statusCode: 409, message: 'No active voting session' })
  }

  // Set board voting state to revealed
  const { error: boardError } = await supabase
    .from('boards')
    .update({
      voting_state: 'revealed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', board.id)

  if (boardError) {
    throw createError({ statusCode: 500, message: boardError.message })
  }

  // Fetch all votes for current issue
  const { data: votes, error: votesError } = await supabase
    .from('votes')
    .select('*')
    .eq('issue_id', boardData.current_issue_id)
    .eq('board_id', board.id)

  if (votesError) {
    throw createError({ statusCode: 500, message: votesError.message })
  }

  return { success: true, votes: votes || [] }
})
