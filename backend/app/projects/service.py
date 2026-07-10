from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.projects.model import Project
from app.projects.repository import ProjectRepository
from app.projects.schema import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: Session) -> None:
        self.repository = ProjectRepository(db)

    def create_project(self, project_data: ProjectCreate) -> Project:
        if self.repository.get_by_code(project_data.code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project code already exists",
            )

        return self.repository.create(project_data)

    def get_project(self, project_id: int) -> Project:
        project = self.repository.get_by_id(project_id)
        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )
        return project

    def get_projects(self, skip: int = 0, limit: int = 100) -> list[Project]:
        return self.repository.get_all(skip=skip, limit=limit)

    def update_project(self, project_id: int, project_data: ProjectUpdate) -> Project:
        project = self.get_project(project_id)

        if project_data.code and project_data.code != project.code:
            existing_project = self.repository.get_by_code(project_data.code)
            if existing_project:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Project code already exists",
                )

        return self.repository.update(project, project_data)
