from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.project_assignments.schema import (
    ProjectAssignmentCreate,
    ProjectAssignmentResponse,
    ProjectAssignmentUpdate,
)
from app.project_assignments.service import ProjectAssignmentService


router = APIRouter(prefix="/project-assignments", tags=["Project Assignments"])


@router.post("/", response_model=ProjectAssignmentResponse, status_code=201)
def create_assignment(
    assignment_data: ProjectAssignmentCreate,
    db: Session = Depends(get_db),
) -> ProjectAssignmentResponse:
    return ProjectAssignmentService(db).create_assignment(assignment_data)


@router.put("/{assignment_id}", response_model=ProjectAssignmentResponse)
def update_assignment(
    assignment_id: int,
    assignment_data: ProjectAssignmentUpdate,
    db: Session = Depends(get_db),
) -> ProjectAssignmentResponse:
    return ProjectAssignmentService(db).update_assignment(assignment_id, assignment_data)


@router.get("/employee/{employee_id}", response_model=list[ProjectAssignmentResponse])
def get_employee_assignments(
    employee_id: int,
    db: Session = Depends(get_db),
) -> list[ProjectAssignmentResponse]:
    return ProjectAssignmentService(db).get_employee_assignments(employee_id)
