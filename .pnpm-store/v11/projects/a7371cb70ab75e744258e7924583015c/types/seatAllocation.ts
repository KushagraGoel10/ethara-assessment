export interface SeatAllocation {
  id: number
  employee_id: number
  seat_id: number
  allocated_at: string
  released_at: string | null
  is_active: boolean
}

export interface SeatAllocationPayload {
  employee_id: number
  seat_id: number
}
