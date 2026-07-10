import api from "@/services/api"
import { getEmployees } from "@/services/employees"
import { getApiErrorMessage } from "@/services/errors"
import type { Seat, SeatAllocation, SeatPayload, SeatUpdatePayload } from "@/types/seat"

type GetSeatsParams = {
  seatNumber?: string
  floorId?: number
  zoneId?: number
}

export async function getSeats(params: GetSeatsParams = {}): Promise<Seat[]> {
  const response = await api.get<Seat[]>("/seats/", {
    params: {
      skip: 0,
      limit: 100,
      floor_id: params.floorId,
      zone_id: params.zoneId,
      seat_number: params.seatNumber || undefined,
    },
  })

  return response.data
}

export async function createSeat(payload: SeatPayload): Promise<Seat> {
  try {
    const response = await api.post<Seat>("/seats/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save seat."))
  }
}

export async function updateSeat(seatId: number, payload: SeatUpdatePayload): Promise<Seat> {
  try {
    const response = await api.put<Seat>(`/seats/${seatId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save seat."))
  }
}

export async function getOccupiedSeatIds(): Promise<Set<number>> {
  const employees = await getEmployees()
  const allocations = await Promise.all(
    employees.map(async (employee) => {
      const response = await api.get<SeatAllocation[]>(
        `/seat-allocations/employee/${employee.id}`,
      )

      return response.data
    }),
  )

  return new Set(
    allocations
      .flat()
      .filter((allocation) => allocation.is_active)
      .map((allocation) => allocation.seat_id),
  )
}
