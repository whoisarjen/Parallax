export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')
  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const body = await readBody(event)
  const { issueId, participantId, value, deviceId } = body

  if (!issueId || typeof issueId !== 'string') {
    throw createError({ statusCode: 400, message: 'Issue ID is required' })
  }
  if (!participantId || typeof participantId !== 'string') {
    throw createError({ statusCode: 400, message: 'Participant ID is required' })
  }
  if (!value || typeof value !== 'string') {
    throw createError({ statusCode: 400, message: 'Vote value is required' })
  }
  if (!deviceId || typeof deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  const supabase = useServerSupabase()

  // Fetch board
  const { data: board } = await supabase
    .from('boards')
    .select('id, voting_state, current_issue_id')
    .eq('id', boardId)
    .is('deleted_at', null)
    .single()

  if (!board) {
    throw createError({ statusCode: 404, message: 'Board not found' })
  }

  // Validate voting state
  if (board.voting_state !== 'voting') {
    throw createError({ statusCode: 409, message: 'Voting is not currently active' })
  }

  // Validate issue matches current voting issue
  if (board.current_issue_id !== issueId) {
    throw createError({ statusCode: 409, message: 'This issue is not currently being voted on' })
  }

  // Validate participant exists, belongs to board, and verify device
  const { data: participant } = await supabase
    .from('participants')
    .select('id, board_id, device_id, role')
    .eq('id', participantId)
    .eq('board_id', board.id)
    .single()

  if (!participant) {
    throw createError({ statusCode: 404, message: 'Participant not found on this board' })
  }

  if (participant.device_id !== deviceId) {
    throw createError({ statusCode: 403, message: 'Device mismatch' })
  }

  // Validate role (spectators cannot vote)
  if (participant.role === 'spectator') {
    throw createError({ statusCode: 403, message: 'Spectators cannot vote' })
  }

  // Upsert vote (allows changing vote before reveal)
  const { data: vote, error: voteError } = await supabase
    .from('votes')
    .upsert(
      {
        issue_id: issueId,
        participant_id: participantId,
        board_id: board.id,
        value: value.slice(0, 10),
        voted_at: new Date().toISOString(),
      },
      { onConflict: 'issue_id,participant_id' },
    )
    .select()
    .single()

  if (voteError) {
    throw createError({ statusCode: 500, message: voteError.message })
  }

  return vote
})
