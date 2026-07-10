import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createZone, getZones, updateZone } from "@/services/zones"
import type { ZoneUpdatePayload } from "@/types/zone"

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  })
}

export function useCreateZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ZoneUpdatePayload }) =>
      updateZone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
