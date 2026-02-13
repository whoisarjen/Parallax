export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  const body = await readBody(event)

  if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
    throw createError({ statusCode: 400, message: 'orderedIds array is required' })
  }

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  const normalizedCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  const formattedCode = normalizedCode.slice(0, 4) + '-' + normalizedCode.slice(4)

  const supabase = useServerSupabase()

  // Find the board
  const { data: board } = await supabase
    .from('boards')
    .select('id')
    .eq('code', formattedCode)
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
