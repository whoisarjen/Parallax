import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

export async function validateFacilitatorToken(event: H3Event, boardId: string) {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Facilitator token required' })
  }

  const token = authHeader.slice(7)
  const tokenHash = createHash('sha256').update(token).digest('hex')

  const supabase = useServerSupabase()

  const { data: board } = await supabase
    .from('boards')
    .select('id, facilitator_token_hash')
    .eq('id', boardId)
    .is('deleted_at', null)
    .single()

  if (!board) {
    throw createError({ statusCode: 404, message: 'Board not found' })
  }

  if (board.facilitator_token_hash !== tokenHash) {
    throw createError({ statusCode: 403, message: 'Invalid facilitator token' })
  }

  return board
}
