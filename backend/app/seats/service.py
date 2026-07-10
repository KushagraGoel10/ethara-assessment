from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.seats.model import Seat
from app.seats.repository import SeatRepository
from app.seats.schema import SeatCreate, SeatUpdate


class SeatService:
    def __init__(self, db: Session) -> None:
        self.repository = SeatRepository(db)

    def create_seat(self, seat_data: SeatCreate) -> Seat:
        if self.repository.get_by_zone_and_seat_number(seat_data.zone_id, seat_data.seat_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Seat number already exists in this zone",
            )

        return self.repository.create(seat_data)

    def get_seat(self, seat_id: int) -> Seat:
        seat = self.repository.get_by_id(seat_id)
        if seat is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seat not found",
            )
        return seat

    def get_seats(
        self,
        skip: int = 0,
        limit: int = 100,
        floor_id: int | None = None,
        zone_id: int | None = None,
        seat_number: str | None = None,
    ) -> list[Seat]:
        return self.repository.get_all(
            skip=skip,
            limit=limit,
            floor_id=floor_id,
            zone_id=zone_id,
            seat_number=seat_number,
        )

    def update_seat(self, seat_id: int, seat_data: SeatUpdate) -> Seat:
        seat = self.get_seat(seat_id)
        zone_id = seat_data.zone_id if seat_data.zone_id is not None else seat.zone_id
        seat_number = seat_data.seat_number if seat_data.seat_number is not None else seat.seat_number

        if zone_id != seat.zone_id or seat_number != seat.seat_number:
            existing_seat = self.repository.get_by_zone_and_seat_number(zone_id, seat_number)
            if existing_seat:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Seat number already exists in this zone",
                )

        return self.repository.update(seat, seat_data)
