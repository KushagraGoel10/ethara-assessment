from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ZoneBase(BaseModel):
    floor_id: int
    name: str


class ZoneCreate(ZoneBase):
    pass


class ZoneUpdate(BaseModel):
    floor_id: int | None = None
    name: str | None = None


class ZoneResponse(ZoneBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
