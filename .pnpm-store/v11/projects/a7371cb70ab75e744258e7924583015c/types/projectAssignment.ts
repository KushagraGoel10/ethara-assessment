export interface ProjectAssignment {
  id: number
  employee_id: number
  project_id: number
  assigned_at: string
  is_active: boolean
}

export interface ProjectAssignmentPayload {
  employee_id: number
  project_id: number
}

export interface ProjectAssignmentUpdatePayload {
  project_id?: number
  is_active?: boolean
}
