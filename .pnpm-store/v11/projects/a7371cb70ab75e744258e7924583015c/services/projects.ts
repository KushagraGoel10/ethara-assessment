import api from "@/services/api"
import { getApiErrorMessage } from "@/services/errors"
import type { Project, ProjectPayload, ProjectUpdatePayload } from "@/types/project"

export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>("/projects/", {
    params: { skip: 0, limit: 100 },
  })

  return response.data
}

export async function createProject(payload: ProjectPayload): Promise<Project> {
  try {
    const response = await api.post<Project>("/projects/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save project."))
  }
}

export async function updateProject(
  projectId: number,
  payload: ProjectUpdatePayload,
): Promise<Project> {
  try {
    const response = await api.put<Project>(`/projects/${projectId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save project."))
  }
}
