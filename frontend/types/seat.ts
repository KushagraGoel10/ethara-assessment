export interface Seat {
  id: number
  zone_id: number
  seat_number: string
  created_at: string
}

export interface SeatPayload {
  zone_id: number
  seat_number: string
}

export type SeatUpdatePayload = Partial<SeatPayload>

export interface SeatAllocation {
  id: number
  employee_id: number
  seat_id: number
  allocated_at: string
  released_at: string | null
  is_active: boolean
}
