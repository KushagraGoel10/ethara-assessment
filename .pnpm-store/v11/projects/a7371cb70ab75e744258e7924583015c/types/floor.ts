export interface Floor {
  id: number
  name: string
  created_at: string
}

export interface FloorPayload {
  name: string
}

export type FloorUpdatePayload = Partial<FloorPayload>
