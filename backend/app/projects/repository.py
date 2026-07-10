from sqlalchemy import select
from sqlalchemy.orm import Session

from app.projects.model import Project
from app.projects.schema import ProjectCreate, ProjectUpdate


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, project_data: ProjectCreate) -> Project:
        project = Project(**project_data.model_dump())
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def get_by_id(self, project_id: int) -> Project | None:
        return self.db.get(Project, project_id)

    def get_by_code(self, code: str) -> Project | None:
        statement = select(Project).where(Project.code == code)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Project]:
        statement = select(Project).order_by(Project.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def update(self, project: Project, project_data: ProjectUpdate) -> Project:
        update_data = project_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(project, field, value)

        self.db.commit()
        self.db.refresh(project)
        return project
