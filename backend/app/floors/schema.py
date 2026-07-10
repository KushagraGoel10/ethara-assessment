from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FloorBase(BaseModel):
    name: str


class FloorCreate(FloorBase):
    pass


class FloorUpdate(BaseModel):
    name: str | None = None


class FloorResponse(FloorBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
