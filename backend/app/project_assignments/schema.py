from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectAssignmentBase(BaseModel):
    employee_id: int
    project_id: int


class ProjectAssignmentCreate(ProjectAssignmentBase):
    pass


class ProjectAssignmentUpdate(BaseModel):
    project_id: int | None = None
    is_active: bool | None = None


class ProjectAssignmentResponse(ProjectAssignmentBase):
    id: int
    assigned_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
