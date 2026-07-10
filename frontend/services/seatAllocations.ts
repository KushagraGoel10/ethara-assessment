import api from "@/services/api"
import { getEmployees } from "@/services/employees"
import { getApiErrorMessage } from "@/services/errors"
import type { SeatAllocation, SeatAllocationPayload } from "@/types/seatAllocation"

export async function getSeatAllocations(): Promise<SeatAllocation[]> {
  const employees = await getEmployees()
  const allocations = await Promise.all(
    employees.map(async (employee) => {
      const response = await api.get<SeatAllocation[]>(
        `/seat-allocations/employee/${employee.id}`,
      )

      return response.data
    }),
  )

  return allocations.flat().sort((a, b) => b.id - a.id)
}

export async function createSeatAllocation(
  payload: SeatAllocationPayload,
): Promise<SeatAllocation> {
  try {
    const response = await api.post<SeatAllocation>("/seat-allocations/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to allocate seat."))
  }
}

export async function releaseSeatAllocation(allocationId: number): Promise<SeatAllocation> {
  try {
    const response = await api.put<SeatAllocation>(
      `/seat-allocations/${allocationId}/release`,
    )

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to release seat allocation."))
  }
}
