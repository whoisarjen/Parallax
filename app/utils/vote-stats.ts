import type { Vote } from '~/types'

export interface VoteStats {
  average: number | null
  median: number | null
  mode: string[]
  distribution: Record<string, number>
  totalVotes: number
  agreement: number
}

export function calculateVoteStats(votes: Vote[]): VoteStats {
  if (votes.length === 0) {
    return { average: null, median: null, mode: [], distribution: {}, totalVotes: 0, agreement: 0 }
  }

  const distribution: Record<string, number> = {}
  const numericValues: number[] = []

  for (const vote of votes) {
    distribution[vote.value] = (distribution[vote.value] || 0) + 1
    const num = parseFloat(vote.value === '½' ? '0.5' : vote.value)
    if (!isNaN(num)) numericValues.push(num)
  }

  numericValues.sort((a, b) => a - b)

  const average = numericValues.length > 0
    ? Math.round((numericValues.reduce((a, b) => a + b, 0) / numericValues.length) * 10) / 10
    : null

  let median: number | null = null
  if (numericValues.length > 0) {
    const mid = Math.floor(numericValues.length / 2)
    median = numericValues.length % 2 === 0
      ? Math.round(((numericValues[mid - 1] + numericValues[mid]) / 2) * 10) / 10
      : numericValues[mid]
  }

  const maxCount = Math.max(...Object.values(distribution))
  const mode = Object.entries(distribution)
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value)

  const agreement = Math.round((maxCount / votes.length) * 100)

  return { average, median, mode, distribution, totalVotes: votes.length, agreement }
}
