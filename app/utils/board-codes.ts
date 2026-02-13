const LETTERS = 'BCDFGHJKMNPQRSTVWXYZ'
const DIGITS = '23456789'

export function generateBoardCode(): string {
  const letterPart = Array.from({ length: 4 }, () =>
    LETTERS[Math.floor(Math.random() * LETTERS.length)],
  ).join('')

  const digitPart = Array.from({ length: 4 }, () =>
    DIGITS[Math.floor(Math.random() * DIGITS.length)],
  ).join('')

  return `${letterPart}-${digitPart}`
}

export function formatBoardCode(input: string): string {
  const clean = input.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  if (clean.length <= 4) return clean
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`
}

export function normalizeBoardCode(input: string): string {
  return input.replace(/[^A-Z0-9]/gi, '').toUpperCase()
}

export function isValidBoardCode(input: string): boolean {
  const normalized = normalizeBoardCode(input)
  return /^[A-Z]{4}[0-9]{4}$/.test(normalized)
}
