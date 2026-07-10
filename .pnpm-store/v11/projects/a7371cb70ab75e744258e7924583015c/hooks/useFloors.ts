import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createFloor, getFloors, updateFloor } from "@/services/floors"
import type { FloorUpdatePayload } from "@/types/floor"

export function useFloors() {
  return useQuery({
    queryKey: ["floors"],
    queryFn: getFloors,
  })
}

export function useCreateFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFloor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateFloor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FloorUpdatePayload }) =>
      updateFloor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floors"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
