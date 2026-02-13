export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const deviceId = query.deviceId as string

  if (!deviceId || typeof deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  const supabase = useServerSupabase()

  // Boards created by this device
  const { data: ownedBoards } = await supabase
    .from('boards')
    .select('id, code, name, deck_type, voting_state, created_at, expires_at')
    .eq('created_by_device', deviceId)
    .is('deleted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  // Boards participated in (via participants table)
  const { data: participations } = await supabase
    .from('participants')
    .select(`
      board_id,
      boards!inner (id, code, name, deck_type, voting_state, created_at, expires_at, created_by_device, deleted_at)
    `)
    .eq('device_id', deviceId)

  const participatedBoards = (participations || [])
    .map((p: any) => p.boards)
    .filter((b: any) =>
      b &&
      b.deleted_at === null &&
      b.created_by_device !== deviceId &&
      new Date(b.expires_at) > new Date(),
    )
    .map(({ deleted_at, created_by_device, ...rest }: any) => rest)

  return {
    owned: ownedBoards || [],
    participated: participatedBoards,
  }
})
