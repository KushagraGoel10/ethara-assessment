import { useQuery } from "@tanstack/react-query"

import { getEmployees } from "@/services/employees"

export function useEmployees(search: string) {
  return useQuery({
    queryKey: ["employees", search],
    queryFn: () => getEmployees({ search }),
  })
}
