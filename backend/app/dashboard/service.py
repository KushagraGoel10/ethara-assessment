from sqlalchemy.orm import Session

from app.dashboard.repository import DashboardRepository
from app.dashboard.schema import DashboardSummaryResponse


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.repository = DashboardRepository(db)

    def get_summary(self) -> DashboardSummaryResponse:
        total_seats = self.repository.count_seats()
        occupied_seats = self.repository.count_occupied_seats()
        available_seats = total_seats - occupied_seats
        seat_utilization_percentage = 0.0

        if total_seats > 0:
            seat_utilization_percentage = round((occupied_seats / total_seats) * 100, 2)

        return DashboardSummaryResponse(
            total_employees=self.repository.count_employees(),
            total_departments=self.repository.count_departments(),
            total_teams=self.repository.count_teams(),
            total_projects=self.repository.count_projects(),
            total_floors=self.repository.count_floors(),
            total_zones=self.repository.count_zones(),
            total_seats=total_seats,
            occupied_seats=occupied_seats,
            available_seats=available_seats,
            seat_utilization_percentage=seat_utilization_percentage,
            active_projects=self.repository.count_active_projects(),
            new_joiners=self.repository.count_new_joiners(),
            new_joiners_without_seat_allocation=self.repository.count_new_joiners_without_seat_allocation(),
            utilization_by_floor=self.repository.get_floor_utilization(),
            utilization_by_team=self.repository.get_team_utilization(),
            utilization_by_project=self.repository.get_project_utilization(),
        )
