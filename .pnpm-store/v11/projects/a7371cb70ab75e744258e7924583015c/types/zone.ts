export interface Zone {
  id: number
  floor_id: number
  name: string
  created_at: string
}

export interface ZonePayload {
  floor_id: number
  name: string
}

export type ZoneUpdatePayload = Partial<ZonePayload>
