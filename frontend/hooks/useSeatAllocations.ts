import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createSeatAllocation,
  getSeatAllocations,
  releaseSeatAllocation,
} from "@/services/seatAllocations"

export function useSeatAllocations() {
  return useQuery({
    queryKey: ["seat-allocations"],
    queryFn: getSeatAllocations,
  })
}

export function useCreateSeatAllocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSeatAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] })
      queryClient.invalidateQueries({ queryKey: ["seats"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useReleaseSeatAllocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: releaseSeatAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] })
      queryClient.invalidateQueries({ queryKey: ["seats"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
