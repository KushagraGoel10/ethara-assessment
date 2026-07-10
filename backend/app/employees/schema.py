from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeBase(BaseModel):
    employee_code: str
    first_name: str
    last_name: str
    email: EmailStr
    designation: str
    department_id: int
    team_id: int
    joining_date: date
    is_new_joiner: bool
    is_active: bool = True


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    employee_code: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    designation: str | None = None
    department_id: int | None = None
    team_id: int | None = None
    joining_date: date | None = None
    is_new_joiner: bool | None = None
    is_active: bool | None = None


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
