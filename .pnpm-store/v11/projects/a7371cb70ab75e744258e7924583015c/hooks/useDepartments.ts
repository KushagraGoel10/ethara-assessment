import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createDepartment, getDepartments, updateDepartment } from "@/services/departments"
import type { DepartmentUpdatePayload } from "@/types/department"

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DepartmentUpdatePayload }) =>
      updateDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
