export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')
  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const board = await validateFacilitatorToken(event, boardId)

  const body = await readBody(event)
  const { issueId, estimate } = body

  if (!issueId || typeof issueId !== 'string') {
    throw createError({ statusCode: 400, message: 'Issue ID is required' })
  }
  if (!estimate || typeof estimate !== 'string') {
    throw createError({ statusCode: 400, message: 'Estimate value is required' })
  }

  const supabase = useServerSupabase()

  // Verify issue belongs to this board
  const { data: issue } = await supabase
    .from('issues')
    .select('id, board_id')
    .eq('id', issueId)
    .eq('board_id', board.id)
    .single()

  if (!issue) {
    throw createError({ statusCode: 404, message: 'Issue not found on this board' })
  }

  // Update issue with final estimate
  const { error: issueError } = await supabase
    .from('issues')
    .update({
      final_estimate: estimate.trim().slice(0, 10),
      status: 'estimated',
      updated_at: new Date().toISOString(),
    })
    .eq('id', issueId)

  if (issueError) {
    throw createError({ statusCode: 500, message: issueError.message })
  }

  // Reset board state
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

  // Delete votes for this issue (cleanup after estimate saved)
  await supabase
    .from('votes')
    .delete()
    .eq('issue_id', issueId)
    .eq('board_id', board.id)

  return { success: true, issueId, estimate: estimate.trim().slice(0, 10) }
})
