import api from "@/services/api"
import { getApiErrorMessage } from "@/services/errors"
import type { Department, DepartmentPayload, DepartmentUpdatePayload } from "@/types/department"

export async function getDepartments(): Promise<Department[]> {
  const response = await api.get<Department[]>("/departments/", {
    params: { skip: 0, limit: 100 },
  })

  return response.data
}

export async function createDepartment(payload: DepartmentPayload): Promise<Department> {
  try {
    const response = await api.post<Department>("/departments/", payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save department."))
  }
}

export async function updateDepartment(
  departmentId: number,
  payload: DepartmentUpdatePayload,
): Promise<Department> {
  try {
    const response = await api.put<Department>(`/departments/${departmentId}`, payload)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to save department."))
  }
}
