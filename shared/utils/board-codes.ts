const LETTERS = 'BCDFGHJKMNPQRSTVWXYZ'
const DIGITS = '23456789'

// Still used by server to satisfy the DB `code` column NOT NULL constraint
export function generateBoardCode(): string {
  const letterPart = Array.from({ length: 4 }, () =>
    LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join('')

  const digitPart = Array.from({ length: 4 }, () =>
    DIGITS[Math.floor(Math.random() * DIGITS.length)],
  ).join('')

  return `${letterPart}-${digitPart}`
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(input: string): boolean {
  return UUID_REGEX.test(input.trim())
}

// Extract board UUID from a URL or raw UUID string
export function extractBoardId(input: string): string | null {
  const trimmed = input.trim()

  // Direct UUID
  if (isValidUUID(trimmed)) {
    return trimmed.toLowerCase()
  }

  // URL containing /board/{uuid}
  const urlMatch = trimmed.match(/\/board\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)
  if (urlMatch) {
    return urlMatch[1].toLowerCase()
  }

  return null
}
