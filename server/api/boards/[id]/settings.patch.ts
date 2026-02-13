export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')

  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const board = await validateFacilitatorToken(event, boardId)
  const body = await readBody(event)

  const updates: Record<string, unknown> = {}

  if (body.name !== undefined) {
    updates.name = validateBoardName(body.name)
  }

  if (body.deckType !== undefined) {
    const validDecks = ['fibonacci', 'modified_fibonacci', 'tshirt', 'powers_of_2', 'custom']
    if (!validDecks.includes(body.deckType)) {
      throw createError({ statusCode: 400, message: 'Invalid deck type' })
    }
    updates.deck_type = body.deckType

    if (body.deckType === 'custom' && body.customDeck) {
      updates.custom_deck = body.customDeck
    }
  }

  if (body.settings !== undefined) {
    if (typeof body.settings !== 'object' || body.settings === null) {
      throw createError({ statusCode: 400, message: 'Settings must be an object' })
    }
    updates.settings = body.settings
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'No valid fields to update' })
  }

  updates.updated_at = new Date().toISOString()

  const supabase = useServerSupabase()

  const { data: updatedBoard, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', board.id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return updatedBoard
})
