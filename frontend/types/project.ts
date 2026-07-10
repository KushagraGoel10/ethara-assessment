export interface Project {
  id: number
  name: string
  code: string
  description: string
  is_active: boolean
  created_at: string
}

export interface ProjectPayload {
  name: string
  code: string
  description: string
  is_active: boolean
}

export type ProjectUpdatePayload = Partial<ProjectPayload>
