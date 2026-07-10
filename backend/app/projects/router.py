from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.projects.schema import ProjectCreate, ProjectResponse, ProjectUpdate
from app.projects.service import ProjectService


router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[ProjectResponse]:
    return ProjectService(db).get_projects(skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)) -> ProjectResponse:
    return ProjectService(db).get_project(project_id)


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)) -> ProjectResponse:
    return ProjectService(db).create_project(project_data)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
) -> ProjectResponse:
    return ProjectService(db).update_project(project_id, project_data)
