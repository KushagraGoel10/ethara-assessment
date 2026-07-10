import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createTeam, getTeams, updateTeam } from "@/services/teams"
import type { TeamUpdatePayload } from "@/types/team"

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TeamUpdatePayload }) =>
      updateTeam(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
