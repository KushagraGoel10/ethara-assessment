import api from "@/services/api"
import { getApiErrorMessage } from "@/services/errors"
import type { Team, TeamPayload, TeamUpdatePayload } from "@/types/team"

export async function getTeams(): Promise<Team[]> {
  const response = await api.get<Team[]>("/teams", {
    params: { skip: 0, limit: 100 },
  })

  return response.data
}

export async function createTeam(payload: TeamPayload): Promise<Team> {
  try {
    const response = await api.post<Team>("/teams", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save team."))
  }
}

export async function updateTeam(teamId: number, payload: TeamUpdatePayload): Promise<Team> {
  try {
    const response = await api.put<Team>(`/teams/${teamId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save team."))
  }
}
