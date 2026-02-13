export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')

  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const body = await readBody(event)

  if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
    throw createError({ statusCode: 400, message: 'orderedIds array is required' })
  }

  const supabase = useServerSupabase()

  // Find the board
  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('id', boardId)
    .is('deleted_at', null)
    .single()

  if (!board) {
    throw createError({ statusCode: 404, message: 'Board not found' })
  }

  // Update sort_order for each issue
  const updates = body.orderedIds.map((id: string, index: number) =>
    supabase
      .from('issues')
      .update({ sort_order: index })
      .eq('id', id)
      .eq('board_id', board.id),
  )

  await Promise.all(updates)

  return { success: true }
})
