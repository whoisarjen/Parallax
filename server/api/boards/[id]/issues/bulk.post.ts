export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, 'id')

  if (!boardId) {
    throw createError({ statusCode: 400, message: 'Board ID is required' })
  }

  const body = await readBody(event)

  if (!Array.isArray(body.issues) || body.issues.length === 0) {
    throw createError({ statusCode: 400, message: 'Issues array is required and must not be empty' })
  }

  if (body.issues.length > 50) {
    throw createError({ statusCode: 400, message: 'Maximum 50 issues per bulk import' })
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

  // Get max sort_order
  const { data: maxIssue } = await supabase
    .from('issues')
    .select('sort_order')
    .eq('board_id', board.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  let sortOrder = (maxIssue?.sort_order ?? -1) + 1

  // Prepare issues for insert
  const issuesToInsert = body.issues.map((issue: any) => {
    if (!issue.title || typeof issue.title !== 'string' || !issue.title.trim()) {
      throw createError({ statusCode: 400, message: 'Each issue must have a title' })
    }

    const jiraKey = issue.jiraKey
      ? (typeof issue.jiraKey === 'string' ? issue.jiraKey.trim().toUpperCase().slice(0, 50) : null)
      : null

    let jiraUrl: string | null = null
    if (issue.jiraUrl && typeof issue.jiraUrl === 'string' && issue.jiraUrl.trim().startsWith('https://')) {
      try {
        const parsed = new URL(issue.jiraUrl.trim())
        if (parsed.protocol === 'https:') {
          jiraUrl = parsed.href
        }
      } catch {
        // Ignore invalid URLs in bulk import
      }
    }

    const record = {
      board_id: board.id,
      title: issue.title.trim().slice(0, 200),
      jira_key: jiraKey,
      jira_url: jiraUrl,
      sort_order: sortOrder++,
    }

    return record
  })

  const { data: issues, error } = await supabase
    .from('issues')
    .insert(issuesToInsert)
    .select()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { issues, count: issues?.length ?? 0 }
})
