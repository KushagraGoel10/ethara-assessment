import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createProject, getProjects, updateProject } from "@/services/projects"
import type { ProjectUpdatePayload } from "@/types/project"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectUpdatePayload }) =>
      updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
