from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    name: str
    code: str
    description: str
    is_active: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None
    is_active: bool | None = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
