from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.seats.schema import SeatCreate, SeatResponse, SeatUpdate
from app.seats.service import SeatService


router = APIRouter(prefix="/seats", tags=["Seats"])


@router.get("/", response_model=list[SeatResponse])
def get_seats(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    floor_id: int | None = None,
    zone_id: int | None = None,
    seat_number: str | None = None,
    db: Session = Depends(get_db),
) -> list[SeatResponse]:
    return SeatService(db).get_seats(
        skip=skip,
        limit=limit,
        floor_id=floor_id,
        zone_id=zone_id,
        seat_number=seat_number,
    )


@router.get("/{seat_id}", response_model=SeatResponse)
def get_seat(seat_id: int, db: Session = Depends(get_db)) -> SeatResponse:
    return SeatService(db).get_seat(seat_id)


@router.post("/", response_model=SeatResponse, status_code=201)
def create_seat(seat_data: SeatCreate, db: Session = Depends(get_db)) -> SeatResponse:
    return SeatService(db).create_seat(seat_data)


@router.put("/{seat_id}", response_model=SeatResponse)
def update_seat(
    seat_id: int,
    seat_data: SeatUpdate,
    db: Session = Depends(get_db),
) -> SeatResponse:
    return SeatService(db).update_seat(seat_id, seat_data)
