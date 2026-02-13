import { BOARD_EXPIRY_MS } from '~~/shared/constants'

export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')

  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const supabase = useServerSupabase()

  // Fetch board separately from relations for better error isolation
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .is('deleted_at', null)
    .single()

  if (boardError || !board) {
    throw createError({
      statusCode: 404,
      message: `Board not found (id: ${boardId}, error: ${boardError?.message || 'no data'}, code: ${boardError?.code || 'none'})`,
    })
  }

  // Fetch participants
  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('board_id', board.id)

  // Fetch issues
  const { data: issues } = await supabase
    .from('issues')
    .select('*')
    .eq('board_id', board.id)
    .order('sort_order', { ascending: true })

  board.participants = participants || []
  board.issues = issues || []

  // Check if board has expired
  if (new Date(board.expires_at) < new Date()) {
    throw createError({ statusCode: 410, message: 'This board has expired due to inactivity' })
  }

  // Auto-extend expiry on access
  await supabase
    .from('boards')
    .update({ expires_at: new Date(Date.now() + BOARD_EXPIRY_MS).toISOString() })
    .eq('id', board.id)

  return board
})
