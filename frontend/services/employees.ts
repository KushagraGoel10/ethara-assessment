import api from "@/services/api"
import type { Employee, EmployeePayload, EmployeeUpdatePayload } from "@/types/employee"

type ApiErrorResponse = {
  detail?: string
}

type GetEmployeesParams = {
  search?: string
}

export async function getEmployees(params: GetEmployeesParams = {}): Promise<Employee[]> {
  const response = await api.get<Employee[]>("/employees/", {
    params: {
      skip: 0,
      limit: 100,
      search: params.search || undefined,
    },
  })

  return response.data
}

export async function createEmployee(employeeData: EmployeePayload): Promise<Employee> {
  try {
    const response = await api.post<Employee>("/employees/", employeeData)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function updateEmployee(
  employeeId: number,
  employeeData: EmployeeUpdatePayload,
): Promise<Employee> {
  try {
    const response = await api.put<Employee>(`/employees/${employeeId}`, employeeData)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

function getApiErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as ApiErrorResponse

    if (data.detail) {
      return data.detail
    }
  }

  return "Unable to save employee."
}
