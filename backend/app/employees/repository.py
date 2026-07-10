from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.employees.model import Employee
from app.employees.schema import EmployeeCreate, EmployeeUpdate


class EmployeeRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, employee_data: EmployeeCreate) -> Employee:
        employee = Employee(**employee_data.model_dump())
        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)
        return employee

    def get_by_id(self, employee_id: int) -> Employee | None:
        return self.db.get(Employee, employee_id)

    def get_by_employee_code(self, employee_code: str) -> Employee | None:
        statement = select(Employee).where(Employee.employee_code == employee_code)
        return self.db.scalar(statement)

    def get_by_email(self, email: str) -> Employee | None:
        statement = select(Employee).where(Employee.email == email)
        return self.db.scalar(statement)

    def get_all(self, skip: int = 0, limit: int = 100, search: str | None = None) -> list[Employee]:
        statement = select(Employee).order_by(Employee.id).offset(skip).limit(limit)

        if search:
            search_term = f"%{search}%"
            statement = (
                select(Employee)
                .where(
                    or_(
                        Employee.employee_code.ilike(search_term),
                        Employee.first_name.ilike(search_term),
                        Employee.last_name.ilike(search_term),
                    )
                )
                .order_by(Employee.id)
                .offset(skip)
                .limit(limit)
            )

        return list(self.db.scalars(statement).all())

    def update(self, employee: Employee, employee_data: EmployeeUpdate) -> Employee:
        update_data = employee_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(employee, field, value)

        self.db.commit()
        self.db.refresh(employee)
        return employee
