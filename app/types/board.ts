export type VotingState = 'idle' | 'voting' | 'revealed'
export type DeckType = 'fibonacci' | 'modified_fibonacci' | 'tshirt' | 'powers_of_2' | 'custom'

export interface BoardSettings {
  timerEnabled: boolean
  timerDuration: number
  allowSpectatorMode: boolean
}

export interface Board {
  id: string
  code: string
  name: string
  created_by_device: string
  deck_type: DeckType
  custom_deck: string[] | null
  current_issue_id: string | null
  voting_state: VotingState
  settings: BoardSettings
  created_at: string
  updated_at: string
  expires_at: string
  deleted_at: string | null
}
