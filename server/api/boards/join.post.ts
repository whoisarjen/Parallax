export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const displayName = validateDisplayName(body.displayName)
  const deviceId = body.deviceId as string
  const boardId = body.boardId as string

  if (!deviceId || typeof deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  if (!boardId || typeof boardId !== 'string') {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const supabase = useServerSupabase()

  // Find board
  const { data: board } = await supabase
    .from('boards')
    .select('id, expires_at')
    .eq('id', boardId)
    .is('deleted_at', null)
    .single()

  if (!board) {
    throw createError({ statusCode: 404, message: 'Board not found' })
  }

  if (new Date(board.expires_at) < new Date()) {
    throw createError({ statusCode: 410, message: 'This board has expired' })
  }

  // Check participant limit (10 max)
  const { count } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('board_id', board.id)

  if (count !== null && count >= 10) {
    // Check if device already has a participant (re-join is allowed)
    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('board_id', board.id)
      .eq('device_id', deviceId)
      .maybeSingle()

    if (!existing) {
      throw createError({ statusCode: 429, message: 'This board is full (10/10 participants)' })
    }
  }

  // Upsert participant (handles rejoin)
  const { data: participant, error } = await supabase
    .from('participants')
    .upsert(
      {
        board_id: board.id,
        device_id: deviceId,
        display_name: displayName,
        role: 'voter',
        is_online: true,
      },
      { onConflict: 'board_id,device_id', ignoreDuplicates: false },
    )
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { board_id: board.id, participant }
})
