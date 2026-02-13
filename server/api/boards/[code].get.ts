export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  const normalizedCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase()

  const supabase = useServerSupabase()

  const { data: board, error } = await supabase
    .from('boards')
    .select(`
      *,
      participants (*),
      issues (*)
    `)
    .eq('code', normalizedCode.slice(0, 4) + '-' + normalizedCode.slice(4))
    .is('deleted_at', null)
    .single()

  if (error || !board) {
    throw createError({ statusCode: 404, message: 'Board not found' })
  }

  // Check if board has expired
  if (new Date(board.expires_at) < new Date()) {
    throw createError({ statusCode: 410, message: 'This board has expired due to inactivity' })
  }

  // Auto-extend expiry on access
  await supabase
    .from('boards')
    .update({ expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })
    .eq('id', board.id)

  // Sort issues by sort_order
  if (board.issues) {
    board.issues.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
  }

  return board
})
