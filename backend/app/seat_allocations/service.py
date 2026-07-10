from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.seat_allocations.model import SeatAllocation
from app.seat_allocations.repository import SeatAllocationRepository
from app.seat_allocations.schema import SeatAllocationCreate


class SeatAllocationService:
    def __init__(self, db: Session) -> None:
        self.repository = SeatAllocationRepository(db)

    def create_allocation(self, allocation_data: SeatAllocationCreate) -> SeatAllocation:
        employee = self.repository.get_employee(allocation_data.employee_id)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        seat = self.repository.get_seat(allocation_data.seat_id)
        if seat is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seat not found",
            )

        if self.repository.get_active_by_employee(allocation_data.employee_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee already has an active seat allocation",
            )

        if self.repository.get_active_by_seat(allocation_data.seat_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Seat is already occupied",
            )

        return self.repository.create(allocation_data)

    def release_allocation(self, allocation_id: int) -> SeatAllocation:
        allocation = self.repository.get_by_id(allocation_id)
        if allocation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Seat allocation not found",
            )

        if not allocation.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Seat allocation is already released",
            )

        return self.repository.release(allocation)

    def get_employee_allocations(self, employee_id: int) -> list[SeatAllocation]:
        employee = self.repository.get_employee(employee_id)
        if employee is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )

        return self.repository.get_by_employee(employee_id)
