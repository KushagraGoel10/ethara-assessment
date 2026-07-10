from enum import Enum

from pydantic import BaseModel


class AIIntent(str, Enum):
    EMPLOYEE_SEAT = "employee_seat"
    EMPLOYEE_PROJECT = "employee_project"
    AVAILABLE_SEATS = "available_seats"
    SEATS_BY_FLOOR = "seats_by_floor"
    EMPLOYEES_BY_TEAM = "employees_by_team"
    EMPLOYEES_BY_PROJECT = "employees_by_project"
    NEW_JOINERS_WITHOUT_SEAT = "new_joiners_without_seat"
    DASHBOARD_SUMMARY = "dashboard_summary"


class AIQueryRequest(BaseModel):
    query: str


class AIIntentResult(BaseModel):
    intent: AIIntent
    employee: str | None = None
    floor: str | None = None
    team: str | None = None
    project: str | None = None


class AIQueryResponse(BaseModel):
    intent: AIIntent
    response: str
