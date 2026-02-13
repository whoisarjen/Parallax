export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')
  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const board = await validateFacilitatorToken(event, boardId)

  const body = await readBody(event)
  const { issueId } = body

  if (!issueId || typeof issueId !== 'string') {
    throw createError({ statusCode: 400, message: 'Issue ID is required' })
  }

  const supabase = useServerSupabase()

  // Verify the issue belongs to this board
  const { data: issue } = await supabase
    .from('issues')
    .select('id, board_id')
    .eq('id', issueId)
    .eq('board_id', board.id)
    .single()

  if (!issue) {
    throw createError({ statusCode: 404, message: 'Issue not found on this board' })
  }

  // Reset any previously voting issues back to pending
  await supabase
    .from('issues')
    .update({ status: 'pending', updated_at: new Date().toISOString() })
    .eq('board_id', board.id)
    .eq('status', 'voting')

  // Delete existing votes for this issue (clean start)
  await supabase
    .from('votes')
    .delete()
    .eq('issue_id', issueId)
    .eq('board_id', board.id)

  // Set board voting state
  const { error: boardError } = await supabase
    .from('boards')
    .update({
      voting_state: 'voting',
      current_issue_id: issueId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', board.id)

  if (boardError) {
    throw createError({ statusCode: 500, message: boardError.message })
  }

  // Set issue status to voting
  const { error: issueError } = await supabase
    .from('issues')
    .update({
      status: 'voting',
      updated_at: new Date().toISOString(),
    })
    .eq('id', issueId)

  if (issueError) {
    throw createError({ statusCode: 500, message: issueError.message })
  }

  return { success: true, issueId }
})
