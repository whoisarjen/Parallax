import type { DeckType } from '~/types'

export interface DeckConfig {
  id: DeckType
  name: string
  cards: string[]
  description: string
}

export const DECK_CONFIGS: Record<Exclude<DeckType, 'custom'>, DeckConfig> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    cards: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'],
    description: 'Classic Fibonacci sequence',
  },
  modified_fibonacci: {
    id: 'modified_fibonacci',
    name: 'Modified Fibonacci',
    cards: ['0', '½', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕'],
    description: 'Standard Scrum poker deck',
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Sizes',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
    description: 'Simple size-based estimation',
  },
  powers_of_2: {
    id: 'powers_of_2',
    name: 'Powers of 2',
    cards: ['0', '1', '2', '4', '8', '16', '32', '64', '?', '☕'],
    description: 'Exponential scale',
  },
}

export function getDeckCards(deckType: DeckType, customDeck?: string[] | null): string[] {
  if (deckType === 'custom' && customDeck?.length) return customDeck
  return DECK_CONFIGS[deckType as Exclude<DeckType, 'custom'>]?.cards ?? DECK_CONFIGS.fibonacci.cards
}
