from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.seat_allocations.schema import SeatAllocationCreate, SeatAllocationResponse
from app.seat_allocations.service import SeatAllocationService


router = APIRouter(prefix="/seat-allocations", tags=["Seat Allocations"])


@router.post("/", response_model=SeatAllocationResponse, status_code=201)
def create_allocation(
    allocation_data: SeatAllocationCreate,
    db: Session = Depends(get_db),
) -> SeatAllocationResponse:
    return SeatAllocationService(db).create_allocation(allocation_data)


@router.put("/{allocation_id}/release", response_model=SeatAllocationResponse)
def release_allocation(
    allocation_id: int,
    db: Session = Depends(get_db),
) -> SeatAllocationResponse:
    return SeatAllocationService(db).release_allocation(allocation_id)


@router.get("/employee/{employee_id}", response_model=list[SeatAllocationResponse])
def get_employee_allocations(
    employee_id: int,
    db: Session = Depends(get_db),
) -> list[SeatAllocationResponse]:
    return SeatAllocationService(db).get_employee_allocations(employee_id)
