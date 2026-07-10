import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import HTTPException, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.ai.schema import AIIntent, AIIntentResult, AIQueryResponse
from app.core.config import settings
from app.dashboard.service import DashboardService
from app.employees.model import Employee
from app.employees.service import EmployeeService
from app.floors.model import Floor
from app.floors.service import FloorService
from app.project_assignments.service import ProjectAssignmentService
from app.projects.model import Project
from app.projects.service import ProjectService
from app.seat_allocations.service import SeatAllocationService
from app.seats.model import Seat
from app.seats.service import SeatService
from app.teams.model import Team
from app.teams.service import TeamService
from app.zones.model import Zone
from app.zones.service import ZoneService


class AIService:
    def __init__(self, db: Session) -> None:
        self.employee_service = EmployeeService(db)
        self.project_assignment_service = ProjectAssignmentService(db)
        self.seat_allocation_service = SeatAllocationService(db)
        self.seat_service = SeatService(db)
        self.zone_service = ZoneService(db)
        self.floor_service = FloorService(db)
        self.team_service = TeamService(db)
        self.project_service = ProjectService(db)
        self.dashboard_service = DashboardService(db)

    def query(self, query: str) -> AIQueryResponse:
        intent_result = self._extract_intent(query)

        handlers = {
            AIIntent.EMPLOYEE_SEAT: self._employee_seat,
            AIIntent.EMPLOYEE_PROJECT: self._employee_project,
            AIIntent.AVAILABLE_SEATS: self._available_seats,
            AIIntent.SEATS_BY_FLOOR: self._seats_by_floor,
            AIIntent.EMPLOYEES_BY_TEAM: self._employees_by_team,
            AIIntent.EMPLOYEES_BY_PROJECT: self._employees_by_project,
            AIIntent.NEW_JOINERS_WITHOUT_SEAT: self._new_joiners_without_seat,
            AIIntent.DASHBOARD_SUMMARY: self._dashboard_summary,
        }

        response = handlers[intent_result.intent](intent_result)
        return AIQueryResponse(intent=intent_result.intent, response=response)

    def _extract_intent(self, query: str) -> AIIntentResult:
        if not settings.OPENAI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI assistant is not configured",
            )

        payload = {
            "model": settings.OPENAI_MODEL,
            "temperature": 0,
            "response_format": {"type": "json_object"},
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You classify seat allocation system questions. "
                        "Return structured JSON only. Do not answer the question. "
                        "Supported intents: employee_seat, employee_project, available_seats, "
                        "seats_by_floor, employees_by_team, employees_by_project, "
                        "new_joiners_without_seat, dashboard_summary. "
                        "Use these optional entity keys only when relevant: employee, floor, team, project. "
                        "If the user gives a partial name, keep the partial text as the entity."
                    ),
                },
                {
                    "role": "user",
                    "content": query,
                },
            ],
        }

        request = Request(
            "https://api.openai.com/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=20) as response:
                response_data = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to classify AI query",
            ) from exc

        try:
            content = response_data["choices"][0]["message"]["content"]
            return AIIntentResult.model_validate_json(content)
        except (KeyError, IndexError, TypeError, ValidationError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Invalid AI classification response",
            ) from exc

    def _employee_seat(self, intent_result: AIIntentResult) -> str:
        employee = self._find_employee(intent_result.employee)
        if employee is None:
            return self._not_found("employee", intent_result.employee)

        active_allocation = self._get_active_seat_allocation(employee.id)
        if active_allocation is None:
            return f"{self._employee_name(employee)} does not have an active seat allocation."

        seat = self.seat_service.get_seat(active_allocation.seat_id)
        zone = self.zone_service.get_zone(seat.zone_id)
        floor = self.floor_service.get_floor(zone.floor_id)
        return f"{self._employee_name(employee)} is seated at {seat.seat_number}, {zone.name}, {floor.name}."

    def _employee_project(self, intent_result: AIIntentResult) -> str:
        employee = self._find_employee(intent_result.employee)
        if employee is None:
            return self._not_found("employee", intent_result.employee)

        active_assignment = self._get_active_project_assignment(employee.id)
        if active_assignment is None:
            return f"{self._employee_name(employee)} does not have an active project assignment."

        project = self.project_service.get_project(active_assignment.project_id)
        return f"{self._employee_name(employee)} is assigned to {project.name}."

    def _available_seats(self, intent_result: AIIntentResult) -> str:
        seats = self.seat_service.get_seats(limit=10000)
        occupied_seat_ids = self._get_occupied_seat_ids()
        available_seats = [seat for seat in seats if seat.id not in occupied_seat_ids]

        if not available_seats:
            return "There are no available seats right now."

        sample = ", ".join(seat.seat_number for seat in available_seats[:10])
        return f"There are {len(available_seats)} available seats. Examples: {sample}."

    def _seats_by_floor(self, intent_result: AIIntentResult) -> str:
        floor = self._find_floor(intent_result.floor)
        if floor is None:
            return self._not_found("floor", intent_result.floor)

        seats = self.seat_service.get_seats(limit=10000, floor_id=floor.id)
        occupied_seat_ids = self._get_occupied_seat_ids()
        occupied_count = sum(1 for seat in seats if seat.id in occupied_seat_ids)
        available_count = len(seats) - occupied_count

        return (
            f"{floor.name} has {len(seats)} seats: "
            f"{occupied_count} occupied and {available_count} available."
        )

    def _employees_by_team(self, intent_result: AIIntentResult) -> str:
        team = self._find_team(intent_result.team)
        if team is None:
            return self._not_found("team", intent_result.team)

        employees = [
            employee
            for employee in self.employee_service.get_employees(limit=10000)
            if employee.team_id == team.id
        ]
        return self._employee_list_response(employees, f"{team.name} has")

    def _employees_by_project(self, intent_result: AIIntentResult) -> str:
        project = self._find_project(intent_result.project)
        if project is None:
            return self._not_found("project", intent_result.project)

        employees = []
        for employee in self.employee_service.get_employees(limit=10000):
            active_assignment = self._get_active_project_assignment(employee.id)
            if active_assignment and active_assignment.project_id == project.id:
                employees.append(employee)

        return self._employee_list_response(employees, f"{project.name} has")

    def _new_joiners_without_seat(self, intent_result: AIIntentResult) -> str:
        employees = [
            employee
            for employee in self.employee_service.get_employees(limit=10000)
            if employee.is_new_joiner and self._get_active_seat_allocation(employee.id) is None
        ]
        return self._employee_list_response(employees, "New joiners without seat allocation")

    def _dashboard_summary(self, intent_result: AIIntentResult) -> str:
        summary = self.dashboard_service.get_summary()
        return (
            f"Dashboard summary: {summary.total_employees} employees, "
            f"{summary.total_seats} seats, {summary.occupied_seats} occupied, "
            f"{summary.available_seats} available, and "
            f"{summary.seat_utilization_percentage}% seat utilization."
        )

    def _find_employee(self, employee_name: str | None) -> Employee | None:
        if not employee_name:
            return None

        employees = self.employee_service.get_employees(limit=20, search=employee_name)
        return employees[0] if employees else None

    def _find_floor(self, floor_name: str | None) -> Floor | None:
        return self._find_by_name(self.floor_service.get_floors(limit=10000), floor_name)

    def _find_team(self, team_name: str | None) -> Team | None:
        return self._find_by_name(self.team_service.get_teams(limit=10000), team_name)

    def _find_project(self, project_name: str | None) -> Project | None:
        if not project_name:
            return None

        normalized_project_name = project_name.strip().lower()
        for project in self.project_service.get_projects(limit=10000):
            if (
                project.name.lower() == normalized_project_name
                or project.code.lower() == normalized_project_name
                or normalized_project_name in project.name.lower()
            ):
                return project
        return None

    def _find_by_name(self, items: list[Floor] | list[Team], name: str | None) -> Floor | Team | None:
        if not name:
            return None

        normalized_name = name.strip().lower()
        for item in items:
            if item.name.lower() == normalized_name or normalized_name in item.name.lower():
                return item
        return None

    def _get_active_seat_allocation(self, employee_id: int):
        allocations = self.seat_allocation_service.get_employee_allocations(employee_id)
        return next((allocation for allocation in allocations if allocation.is_active), None)

    def _get_active_project_assignment(self, employee_id: int):
        assignments = self.project_assignment_service.get_employee_assignments(employee_id)
        return next((assignment for assignment in assignments if assignment.is_active), None)

    def _get_occupied_seat_ids(self) -> set[int]:
        occupied_seat_ids: set[int] = set()
        for employee in self.employee_service.get_employees(limit=10000):
            active_allocation = self._get_active_seat_allocation(employee.id)
            if active_allocation:
                occupied_seat_ids.add(active_allocation.seat_id)
        return occupied_seat_ids

    def _employee_list_response(self, employees: list[Employee], prefix: str) -> str:
        if not employees:
            return f"{prefix} no employees."

        names = ", ".join(self._employee_name(employee) for employee in employees[:10])
        extra_count = len(employees) - 10
        suffix = f" and {extra_count} more" if extra_count > 0 else ""
        return f"{prefix} {len(employees)} employees: {names}{suffix}."

    def _employee_name(self, employee: Employee) -> str:
        return f"{employee.first_name} {employee.last_name}".strip()

    def _not_found(self, resource: str, value: str | None) -> str:
        if value:
            return f"I could not find a matching {resource} for '{value}'."
        return f"I need a {resource} name to answer that."
