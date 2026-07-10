import api from "@/services/api"
import { getApiErrorMessage } from "@/services/errors"
import type { Floor, FloorPayload, FloorUpdatePayload } from "@/types/floor"

export async function getFloors(): Promise<Floor[]> {
  const response = await api.get<Floor[]>("/floors/", {
    params: { skip: 0, limit: 100 },
  })

  return response.data
}

export async function createFloor(payload: FloorPayload): Promise<Floor> {
  try {
    const response = await api.post<Floor>("/floors/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save floor."))
  }
}

export async function updateFloor(floorId: number, payload: FloorUpdatePayload): Promise<Floor> {
  try {
    const response = await api.put<Floor>(`/floors/${floorId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save floor."))
  }
}
