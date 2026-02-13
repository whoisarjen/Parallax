import { randomBytes, createHash } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const name = validateBoardName(body.name)
  const displayName = validateDisplayName(body.displayName)
  const deviceId = body.deviceId as string
  const deckType = body.deckType || 'fibonacci'
  const customDeck = deckType === 'custom' ? body.customDeck : null

  if (!deviceId || typeof deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  const supabase = useServerSupabase()

  // Enforce 10-board limit per device
  const { count } = await supabase
    .from('boards')
    .select('*', { count: 'exact', head: true })
    .eq('created_by_device', deviceId)
    .is('deleted_at', null)

  if (count !== null && count >= 10) {
    throw createError({ statusCode: 429, message: 'You have reached the maximum of 10 boards. Delete an existing board to create a new one.' })
  }

  // Generate unique board code with collision retry
  let code: string = ''
  let attempts = 0
  do {
    code = generateBoardCode()
    const { data: existing } = await supabase
      .from('boards')
      .select('id')
      .eq('code', code)
      .maybeSingle()
    if (!existing) break
    attempts++
  } while (attempts < 5)

  if (attempts >= 5) {
    throw createError({ statusCode: 500, message: 'Could not generate unique board code. Please try again.' })
  }

  // Generate facilitator token
  const facilitatorToken = randomBytes(32).toString('hex')
  const facilitatorTokenHash = createHash('sha256').update(facilitatorToken).digest('hex')

  // Create board
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .insert({
      code,
      name,
      created_by_device: deviceId,
      facilitator_token_hash: facilitatorTokenHash,
      deck_type: deckType,
      custom_deck: customDeck,
    })
    .select()
    .single()

  if (boardError) {
    throw createError({ statusCode: 500, message: boardError.message })
  }

  // Create facilitator participant
  const { data: participant, error: partError } = await supabase
    .from('participants')
    .insert({
      board_id: board.id,
      device_id: deviceId,
      display_name: displayName,
      role: 'facilitator',
    })
    .select()
    .single()

  if (partError) {
    throw createError({ statusCode: 500, message: partError.message })
  }

  return { board, participant, facilitatorToken }
})
