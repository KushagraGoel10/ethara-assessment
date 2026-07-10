import api from "@/services/api"
import { getEmployees } from "@/services/employees"
import { getApiErrorMessage } from "@/services/errors"
import type {
  ProjectAssignment,
  ProjectAssignmentPayload,
  ProjectAssignmentUpdatePayload,
} from "@/types/projectAssignment"

export async function getProjectAssignments(): Promise<ProjectAssignment[]> {
  const employees = await getEmployees()
  const assignments = await Promise.all(
    employees.map(async (employee) => {
      const response = await api.get<ProjectAssignment[]>(
        `/project-assignments/employee/${employee.id}`,
      )

      return response.data
    }),
  )

  return assignments.flat().sort((a, b) => b.id - a.id)
}

export async function createProjectAssignment(
  payload: ProjectAssignmentPayload,
): Promise<ProjectAssignment> {
  try {
    const response = await api.post<ProjectAssignment>("/project-assignments/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save project assignment."))
  }
}

export async function updateProjectAssignment(
  assignmentId: number,
  payload: ProjectAssignmentUpdatePayload,
): Promise<ProjectAssignment> {
  try {
    const response = await api.put<ProjectAssignment>(
      `/project-assignments/${assignmentId}`,
      payload,
    )

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save project assignment."))
  }
}
