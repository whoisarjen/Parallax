export type IssueStatus = 'pending' | 'voting' | 'estimated'

export interface Issue {
  id: string
  board_id: string
  title: string
  description: string | null
  jira_key: string | null
  jira_url: string | null
  sort_order: number
  final_estimate: string | null
  status: IssueStatus
  created_at: string
  updated_at: string
}
