import api from "@/services/api"
import { getApiErrorMessage } from "@/services/errors"
import type { Zone, ZonePayload, ZoneUpdatePayload } from "@/types/zone"

export async function getZones(): Promise<Zone[]> {
  const response = await api.get<Zone[]>("/zones", {
    params: { skip: 0, limit: 100 },
  })

  return response.data
}

export async function createZone(payload: ZonePayload): Promise<Zone> {
  try {
    const response = await api.post<Zone>("/zones", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save zone."))
  }
}

export async function updateZone(zoneId: number, payload: ZoneUpdatePayload): Promise<Zone> {
  try {
    const response = await api.put<Zone>(`/zones/${zoneId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save zone."))
  }
}
