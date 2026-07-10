import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createProjectAssignment,
  getProjectAssignments,
  updateProjectAssignment,
} from "@/services/projectAssignments"
import type { ProjectAssignmentUpdatePayload } from "@/types/projectAssignment"

export function useProjectAssignments() {
  return useQuery({
    queryKey: ["project-assignments"],
    queryFn: getProjectAssignments,
  })
}

export function useCreateProjectAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProjectAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-assignments"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateProjectAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: ProjectAssignmentUpdatePayload
    }) => updateProjectAssignment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-assignments"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
