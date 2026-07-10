from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.departments.model import Department
from app.employees.model import Employee
from app.floors.model import Floor
from app.project_assignments.model import ProjectAssignment
from app.projects.model import Project
from app.seat_allocations.model import SeatAllocation
from app.seats.model import Seat
from app.teams.model import Team
from app.zones.model import Zone


class DashboardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def count_employees(self) -> int:
        return self.db.scalar(select(func.count(Employee.id))) or 0

    def count_departments(self) -> int:
        return self.db.scalar(select(func.count(Department.id))) or 0

    def count_teams(self) -> int:
        return self.db.scalar(select(func.count(Team.id))) or 0

    def count_projects(self) -> int:
        return self.db.scalar(select(func.count(Project.id))) or 0

    def count_floors(self) -> int:
        return self.db.scalar(select(func.count(Floor.id))) or 0

    def count_zones(self) -> int:
        return self.db.scalar(select(func.count(Zone.id))) or 0

    def count_seats(self) -> int:
        return self.db.scalar(select(func.count(Seat.id))) or 0

    def count_occupied_seats(self) -> int:
        statement = select(func.count(SeatAllocation.id)).where(SeatAllocation.is_active.is_(True))
        return self.db.scalar(statement) or 0

    def count_active_projects(self) -> int:
        statement = select(func.count(Project.id)).where(Project.is_active.is_(True))
        return self.db.scalar(statement) or 0

    def count_new_joiners(self) -> int:
        statement = select(func.count(Employee.id)).where(Employee.is_new_joiner.is_(True))
        return self.db.scalar(statement) or 0

    def count_new_joiners_without_seat_allocation(self) -> int:
        active_allocations = (
            select(SeatAllocation.employee_id)
            .where(SeatAllocation.is_active.is_(True))
            .subquery()
        )
        statement = (
            select(func.count(Employee.id))
            .outerjoin(active_allocations, Employee.id == active_allocations.c.employee_id)
            .where(Employee.is_new_joiner.is_(True), active_allocations.c.employee_id.is_(None))
        )
        return self.db.scalar(statement) or 0

    def get_floor_utilization(self) -> list[dict[str, int | str]]:
        active_allocations = (
            select(SeatAllocation.seat_id)
            .where(SeatAllocation.is_active.is_(True))
            .subquery()
        )
        statement = (
            select(
                Floor.name,
                func.count(active_allocations.c.seat_id).label("occupied"),
                (func.count(Seat.id) - func.count(active_allocations.c.seat_id)).label("available"),
            )
            .join(Zone, Zone.floor_id == Floor.id)
            .join(Seat, Seat.zone_id == Zone.id)
            .outerjoin(active_allocations, Seat.id == active_allocations.c.seat_id)
            .group_by(Floor.id, Floor.name)
            .order_by(Floor.id)
        )

        return [
            {
                "floor": floor,
                "occupied": occupied,
                "available": available,
            }
            for floor, occupied, available in self.db.execute(statement).all()
        ]

    def get_team_utilization(self) -> list[dict[str, int | str]]:
        statement = (
            select(Team.name, func.count(Employee.id).label("employees"))
            .outerjoin(Employee, Employee.team_id == Team.id)
            .group_by(Team.id, Team.name)
            .order_by(Team.id)
        )

        return [
            {
                "team": team,
                "employees": employees,
            }
            for team, employees in self.db.execute(statement).all()
        ]

    def get_project_utilization(self) -> list[dict[str, int | str]]:
        active_assignments = (
            select(ProjectAssignment.project_id, ProjectAssignment.employee_id)
            .where(ProjectAssignment.is_active.is_(True))
            .subquery()
        )
        statement = (
            select(Project.name, func.count(active_assignments.c.employee_id).label("employees"))
            .outerjoin(active_assignments, Project.id == active_assignments.c.project_id)
            .group_by(Project.id, Project.name)
            .order_by(Project.id)
        )

        return [
            {
                "project": project,
                "employees": employees,
            }
            for project, employees in self.db.execute(statement).all()
        ]
