export default defineEventHandler(async (event) => {
  // Verify cron secret
  const authHeader = getHeader(event, 'authorization')
  const config = useRuntimeConfig()

  if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const supabase = useServerSupabase()
  const now = new Date().toISOString()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Step 1: Soft-delete boards where expires_at < now
  const { data: softDeleted, error: softError } = await supabase
    .from('boards')
    .update({ deleted_at: now })
    .lt('expires_at', now)
    .is('deleted_at', null)
    .select('id')

  if (softError) {
    throw createError({ statusCode: 500, message: `Soft-delete failed: ${softError.message}` })
  }

  // Step 2: Find boards to hard-delete (deleted_at older than 7 days)
  const { data: toHardDelete, error: findError } = await supabase
    .from('boards')
    .select('id')
    .lt('deleted_at', sevenDaysAgo)

  if (findError) {
    throw createError({ statusCode: 500, message: `Find hard-delete targets failed: ${findError.message}` })
  }

  let hardDeletedCount = 0

  if (toHardDelete && toHardDelete.length > 0) {
    const boardIds = toHardDelete.map(b => b.id)

    // Delete votes for these boards
    await supabase
      .from('votes')
      .delete()
      .in('board_id', boardIds)

    // Delete issues for these boards
    await supabase
      .from('issues')
      .delete()
      .in('board_id', boardIds)

    // Delete participants for these boards
    await supabase
      .from('participants')
      .delete()
      .in('board_id', boardIds)

    // Hard-delete the boards
    const { error: hardError } = await supabase
      .from('boards')
      .delete()
      .in('id', boardIds)

    if (hardError) {
      throw createError({ statusCode: 500, message: `Hard-delete failed: ${hardError.message}` })
    }

    hardDeletedCount = boardIds.length
  }

  return {
    softDeleted: softDeleted?.length ?? 0,
    hardDeleted: hardDeletedCount,
    timestamp: now,
  }
})
