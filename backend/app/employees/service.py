from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.employees.model import Employee
from app.employees.repository import EmployeeRepository
from app.employees.schema import EmployeeCreate, EmployeeUpdate


class EmployeeService:
    def __init__(self, db: Session) -> None:
        self.repository = EmployeeRepository(db)

    def create_employee(self, employee_data: EmployeeCreate) -> Employee:
        if self.repository.get_by_employee_code(employee_data.employee_code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee code already exists",
            )

        if self.repository.get_by_email(employee_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists",
            )

        return self.repository.create(employee_data)

    def get_employee(self, employee_id: int) -> Employee:
        employee = self.repository.get_by_id(employee_id)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )
        return employee

    def get_employees(self, skip: int = 0, limit: int = 100, search: str | None = None) -> list[Employee]:
        return self.repository.get_all(skip=skip, limit=limit, search=search)

    def update_employee(self, employee_id: int, employee_data: EmployeeUpdate) -> Employee:
        employee = self.get_employee(employee_id)

        if employee_data.employee_code and employee_data.employee_code != employee.employee_code:
            existing_employee = self.repository.get_by_employee_code(employee_data.employee_code)
            if existing_employee:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employee code already exists",
                )

        if employee_data.email and employee_data.email != employee.email:
            existing_employee = self.repository.get_by_email(employee_data.email)
            if existing_employee:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists",
                )

        return self.repository.update(employee, employee_data)
