from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TeamBase(BaseModel):
    department_id: int
    name: str


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    department_id: int | None = None
    name: str | None = None


class TeamResponse(TeamBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
