from pydantic import BaseModel


class FloorUtilization(BaseModel):
    floor: str
    occupied: int
    available: int


class TeamUtilization(BaseModel):
    team: str
    employees: int


class ProjectUtilization(BaseModel):
    project: str
    employees: int


class DashboardSummaryResponse(BaseModel):
    total_employees: int
    total_departments: int
    total_teams: int
    total_projects: int
    total_floors: int
    total_zones: int
    total_seats: int
    occupied_seats: int
    available_seats: int
    seat_utilization_percentage: float
    active_projects: int
    new_joiners: int
    new_joiners_without_seat_allocation: int
    utilization_by_floor: list[FloorUtilization]
    utilization_by_team: list[TeamUtilization]
    utilization_by_project: list[ProjectUtilization]
