from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SeatBase(BaseModel):
    zone_id: int
    seat_number: str


class SeatCreate(SeatBase):
    pass


class SeatUpdate(BaseModel):
    zone_id: int | None = None
    seat_number: str | None = None


class SeatResponse(SeatBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
