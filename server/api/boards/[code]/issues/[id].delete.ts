export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  const issueId = getRouterParam(event, 'id')

  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  if (!issueId) {
    throw createError({ statusCode: 400, message: 'Issue ID is required' })
  }

  const board = await validateFacilitatorToken(event, code)

  const supabase = useServerSupabase()

  // Delete votes for this issue first (cascade)
  await supabase
    .from('votes')
    .delete()
    .eq('issue_id', issueId)
    .eq('board_id', board.id)

  // Delete the issue
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', issueId)
    .eq('board_id', board.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
