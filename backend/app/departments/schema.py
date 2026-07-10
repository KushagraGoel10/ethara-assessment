from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DepartmentBase(BaseModel):
    name: str


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: str | None = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
