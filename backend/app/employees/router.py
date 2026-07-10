from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.employees.schema import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from app.employees.service import EmployeeService


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/", response_model=list[EmployeeResponse])
def get_employees(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
) -> list[EmployeeResponse]:
    return EmployeeService(db).get_employees(skip=skip, limit=limit, search=search)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)) -> EmployeeResponse:
    return EmployeeService(db).get_employee(employee_id)


@router.post("/", response_model=EmployeeResponse, status_code=201)
def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)) -> EmployeeResponse:
    return EmployeeService(db).create_employee(employee_data)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
) -> EmployeeResponse:
    return EmployeeService(db).update_employee(employee_id, employee_data)
