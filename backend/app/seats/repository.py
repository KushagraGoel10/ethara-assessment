from sqlalchemy import select
from sqlalchemy.orm import Session

from app.seats.model import Seat
from app.seats.schema import SeatCreate, SeatUpdate
from app.zones.model import Zone


class SeatRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, seat_data: SeatCreate) -> Seat:
        seat = Seat(**seat_data.model_dump())
        self.db.add(seat)
        self.db.commit()
        self.db.refresh(seat)
        return seat

    def get_by_id(self, seat_id: int) -> Seat | None:
        return self.db.get(Seat, seat_id)

    def get_by_zone_and_seat_number(self, zone_id: int, seat_number: str) -> Seat | None:
        statement = select(Seat).where(Seat.zone_id == zone_id, Seat.seat_number == seat_number)
        return self.db.scalar(statement)

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        floor_id: int | None = None,
        zone_id: int | None = None,
        seat_number: str | None = None,
    ) -> list[Seat]:
        statement = select(Seat).order_by(Seat.id)

        if floor_id is not None:
            statement = statement.join(Zone, Seat.zone_id == Zone.id).where(Zone.floor_id == floor_id)

        if zone_id is not None:
            statement = statement.where(Seat.zone_id == zone_id)

        if seat_number:
            statement = statement.where(Seat.seat_number.ilike(f"%{seat_number}%"))

        statement = statement.offset(skip).limit(limit)
        return list(self.db.scalars(statement).all())

    def update(self, seat: Seat, seat_data: SeatUpdate) -> Seat:
        update_data = seat_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(seat, field, value)

        self.db.commit()
        self.db.refresh(seat)
        return seat
