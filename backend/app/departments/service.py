from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.departments.model import Department
from app.departments.repository import DepartmentRepository
from app.departments.schema import DepartmentCreate, DepartmentUpdate


class DepartmentService:
    def __init__(self, db: Session) -> None:
        self.repository = DepartmentRepository(db)

    def create_department(self, department_data: DepartmentCreate) -> Department:
        if self.repository.get_by_name(department_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department name already exists",
            )

        return self.repository.create(department_data)

    def get_department(self, department_id: int) -> Department:
        department = self.repository.get_by_id(department_id)
        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )
        return department

    def get_departments(self, skip: int = 0, limit: int = 100) -> list[Department]:
        return self.repository.get_all(skip=skip, limit=limit)

    def update_department(self, department_id: int, department_data: DepartmentUpdate) -> Department:
        department = self.get_department(department_id)

        if department_data.name and department_data.name != department.name:
            existing_department = self.repository.get_by_name(department_data.name)
            if existing_department:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department name already exists",
                )

        return self.repository.update(department, department_data)
