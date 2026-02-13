export function validateDisplayName(name: unknown): string {
  if (typeof name !== 'string' || !name.trim()) {
    throw createError({ statusCode: 400, message: 'Display name is required' })
  }

  const cleaned = name.trim().slice(0, 30)
  const sanitized = cleaned.replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s\-_.]/gu, '')

  if (!sanitized) {
    throw createError({ statusCode: 400, message: 'Display name contains invalid characters' })
  }

  return sanitized
}

export function validateBoardName(name: unknown): string {
  if (typeof name !== 'string' || !name.trim()) {
    throw createError({ statusCode: 400, message: 'Board name is required' })
  }

  const cleaned = name.trim().slice(0, 100)
  const sanitized = cleaned.replace(/<[^>]*>/g, '')

  if (!sanitized) {
    throw createError({ statusCode: 400, message: 'Board name contains invalid characters' })
  }

  return sanitized
}

export function validateJiraUrl(url: unknown): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null

  const trimmed = url.trim()

  if (!trimmed.startsWith('https://')) {
    throw createError({ statusCode: 400, message: 'Jira URL must use HTTPS' })
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:') {
      throw createError({ statusCode: 400, message: 'Jira URL must use HTTPS' })
    }
    return parsed.href
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid Jira URL' })
  }
}

export function validateJiraKey(key: unknown): string | null {
  if (!key || typeof key !== 'string' || !key.trim()) return null

  const trimmed = key.trim().toUpperCase()
  if (!/^[A-Z][A-Z0-9]+-\d+$/.test(trimmed)) {
    return null
  }

  return trimmed.slice(0, 50)
}
