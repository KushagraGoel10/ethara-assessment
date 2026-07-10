export interface FloorUtilization {
  floor: string
  occupied: number
  available: number
}

export interface TeamUtilization {
  team: string
  employees: number
}

export interface ProjectUtilization {
  project: string
  employees: number
}

export interface DashboardSummary {
  total_employees: number
  total_departments: number
  total_teams: number
  total_projects: number
  total_floors: number
  total_zones: number
  total_seats: number
  occupied_seats: number
  available_seats: number
  seat_utilization_percentage: number
  active_projects: number
  new_joiners: number
  new_joiners_without_seat_allocation: number
  utilization_by_floor: FloorUtilization[]
  utilization_by_team: TeamUtilization[]
  utilization_by_project: ProjectUtilization[]
}
