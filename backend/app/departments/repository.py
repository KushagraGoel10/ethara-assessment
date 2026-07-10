from sqlalchemy import select
from sqlalchemy.orm import Session

from app.departments.model import Department
from app.departments.schema import DepartmentCreate, DepartmentUpdate


class DepartmentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, department_data: DepartmentCreate) -> Department:
        department = Department(**department_data.model_dump())
        self.db.add(department)
        self.db.commit()
        self.db.refresh(department)
        return department

    def get_by_id(self, department_id: int) -> Department | None:
        return self.db.get(Department, department_id)

    def get_by_name(self, name: str) -> Department | None:
        statement = select(Department).where(Department.name == name)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Department]:
        statement = select(Department).order_by(Department.id).offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def update(self, department: Department, department_data: DepartmentUpdate) -> Department:
        update_data = department_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(department, field, value)

        self.db.commit()
        self.db.refresh(department)
        return department
