export type ParticipantRole = 'voter' | 'spectator' | 'facilitator'

export interface Participant {
  id: string
  board_id: string
  device_id: string
  display_name: string
  role: ParticipantRole
  is_online: boolean
  created_at: string
  updated_at: string
}
