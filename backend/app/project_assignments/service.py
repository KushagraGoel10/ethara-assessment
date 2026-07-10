from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.project_assignments.model import ProjectAssignment
from app.project_assignments.repository import ProjectAssignmentRepository
from app.project_assignments.schema import ProjectAssignmentCreate, ProjectAssignmentUpdate


class ProjectAssignmentService:
    def __init__(self, db: Session) -> None:
        self.repository = ProjectAssignmentRepository(db)

    def create_assignment(self, assignment_data: ProjectAssignmentCreate) -> ProjectAssignment:
        employee = self.repository.get_employee(assignment_data.employee_id)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        project = self.repository.get_project(assignment_data.project_id)
        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        if not project.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only active projects can be assigned",
            )

        active_assignment = self.repository.get_active_by_employee(assignment_data.employee_id)
        if active_assignment:
            self.repository.deactivate(active_assignment)

        return self.repository.create(assignment_data)

    def update_assignment(
        self,
        assignment_id: int,
        assignment_data: ProjectAssignmentUpdate,
    ) -> ProjectAssignment:
        assignment = self.repository.get_by_id(assignment_id)
        if assignment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project assignment not found",
            )

        if assignment_data.project_id is not None:
            project = self.repository.get_project(assignment_data.project_id)
            if project is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found",
                )
            if not project.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only active projects can be assigned",
                )

        if assignment_data.is_active is True and assignment_data.project_id is None:
            project = self.repository.get_project(assignment.project_id)
            if project is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found",
                )
            if not project.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only active projects can be assigned",
                )

        if assignment_data.is_active is True:
            active_assignment = self.repository.get_active_by_employee(assignment.employee_id)
            if active_assignment and active_assignment.id != assignment.id:
                self.repository.deactivate(active_assignment)

        return self.repository.update(assignment, assignment_data)

    def get_employee_assignments(self, employee_id: int) -> list[ProjectAssignment]:
        employee = self.repository.get_employee(employee_id)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        return self.repository.get_by_employee(employee_id)
