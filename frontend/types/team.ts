export interface Team {
  id: number
  department_id: number
  name: string
  created_at: string
}

export interface TeamPayload {
  department_id: number
  name: string
}

export type TeamUpdatePayload = Partial<TeamPayload>
