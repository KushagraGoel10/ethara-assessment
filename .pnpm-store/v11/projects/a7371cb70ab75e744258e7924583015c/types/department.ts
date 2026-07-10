export interface Department {
  id: number
  name: string
  created_at: string
}

export interface DepartmentPayload {
  name: string
}

export type DepartmentUpdatePayload = Partial<DepartmentPayload>
