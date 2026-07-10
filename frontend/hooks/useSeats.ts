import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createSeat, getOccupiedSeatIds, getSeats, updateSeat } from "@/services/seats"
import type { SeatUpdatePayload } from "@/types/seat"

type SeatFilters = {
  seatNumber?: string
  floorId?: number
  zoneId?: number
}

export function useSeats(filters: SeatFilters) {
  return useQuery({
    queryKey: ["seats", filters],
    queryFn: () => getSeats(filters),
  })
}

export function useOccupiedSeatIds() {
  return useQuery({
    queryKey: ["seats", "occupied"],
    queryFn: getOccupiedSeatIds,
  })
}

export function useCreateSeat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSeat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateSeat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SeatUpdatePayload }) =>
      updateSeat(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
