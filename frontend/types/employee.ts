export interface Employee {
  id: number
  employee_code: string
  first_name: string
  last_name: string
  email: string
  designation: string
  department_id: number
  team_id: number
  joining_date: string
  is_new_joiner: boolean
  is_active: boolean
  created_at: string
}

export interface EmployeePayload {
  employee_code: string
  first_name: string
  last_name: string
  email: string
  designation: string
  department_id: number
  team_id: number
  joining_date: string
  is_new_joiner: boolean
  is_active: boolean
}

export type EmployeeUpdatePayload = Partial<EmployeePayload>
