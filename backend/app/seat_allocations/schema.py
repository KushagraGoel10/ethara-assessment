from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SeatAllocationCreate(BaseModel):
    employee_id: int
    seat_id: int


class SeatAllocationResponse(SeatAllocationCreate):
    id: int
    allocated_at: datetime
    released_at: datetime | None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
