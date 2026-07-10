import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateEmployee } from "@/services/employees"
import type { EmployeeUpdatePayload } from "@/types/employee"

type UpdateEmployeeVariables = {
  employeeId: number
  employeeData: EmployeeUpdatePayload
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ employeeId, employeeData }: UpdateEmployeeVariables) =>
      updateEmployee(employeeId, employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
