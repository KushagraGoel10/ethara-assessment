from sqlalchemy import select
from sqlalchemy.orm import Session

from app.employees.model import Employee
from app.project_assignments.model import ProjectAssignment
from app.project_assignments.schema import ProjectAssignmentCreate, ProjectAssignmentUpdate
from app.projects.model import Project


class ProjectAssignmentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, assignment_data: ProjectAssignmentCreate) -> ProjectAssignment:
        assignment = ProjectAssignment(**assignment_data.model_dump(), is_active=True)
        self.db.add(assignment)
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def get_by_id(self, assignment_id: int) -> ProjectAssignment | None:
        return self.db.get(ProjectAssignment, assignment_id)

    def get_employee(self, employee_id: int) -> Employee | None:
        return self.db.get(Employee, employee_id)

    def get_project(self, project_id: int) -> Project | None:
        return self.db.get(Project, project_id)

    def get_active_by_employee(self, employee_id: int) -> ProjectAssignment | None:
        statement = select(ProjectAssignment).where(
            ProjectAssignment.employee_id == employee_id,
            ProjectAssignment.is_active.is_(True),
        )
        return self.db.scalar(statement)

    def get_by_employee(self, employee_id: int) -> list[ProjectAssignment]:
        statement = (
            select(ProjectAssignment)
            .where(ProjectAssignment.employee_id == employee_id)
            .order_by(ProjectAssignment.id)
        )
        return list(self.db.scalars(statement).all())

    def deactivate(self, assignment: ProjectAssignment) -> ProjectAssignment:
        assignment.is_active = False
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def update(self, assignment: ProjectAssignment, assignment_data: ProjectAssignmentUpdate) -> ProjectAssignment:
        update_data = assignment_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(assignment, field, value)

        self.db.commit()
        self.db.refresh(assignment)
        return assignment
