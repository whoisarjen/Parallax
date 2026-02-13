export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({ statusCode: 400, message: 'Board code is required' })
  }

  const body = await readBody(event)

  // Validate title
  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({ statusCode: 400, message: 'Issue title is required' })
  }

  const title = body.title.trim().slice(0, 200)

  // Validate deviceId
  if (!body.deviceId || typeof body.deviceId !== 'string') {
    throw createError({ statusCode: 400, message: 'Device ID is required' })
  }

  // Validate Jira fields
  const jiraUrl = validateJiraUrl(body.jiraUrl)
  const jiraKey = validateJiraKey(body.jiraKey)

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

  // Get max sort_order
  const { data: maxIssue } = await supabase
    .from('issues')
    .select('sort_order')
    .eq('board_id', board.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (maxIssue?.sort_order ?? -1) + 1

  // Create the issue
  const { data: issue, error } = await supabase
    .from('issues')
    .insert({
      board_id: board.id,
      title,
      description: body.description?.trim()?.slice(0, 2000) || null,
      jira_key: jiraKey,
      jira_url: jiraUrl,
      sort_order: sortOrder,
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return issue
})
