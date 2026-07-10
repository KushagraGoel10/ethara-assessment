from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.departments.schema import DepartmentCreate, DepartmentResponse, DepartmentUpdate
from app.departments.service import DepartmentService


router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("/", response_model=list[DepartmentResponse])
def get_departments(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[DepartmentResponse]:
    return DepartmentService(db).get_departments(skip=skip, limit=limit)


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(department_id: int, db: Session = Depends(get_db)) -> DepartmentResponse:
    return DepartmentService(db).get_department(department_id)


@router.post("/", response_model=DepartmentResponse, status_code=201)
def create_department(department_data: DepartmentCreate, db: Session = Depends(get_db)) -> DepartmentResponse:
    return DepartmentService(db).create_department(department_data)


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    department_data: DepartmentUpdate,
    db: Session = Depends(get_db),
) -> DepartmentResponse:
    return DepartmentService(db).update_department(department_id, department_data)
