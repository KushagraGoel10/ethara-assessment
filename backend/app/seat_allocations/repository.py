from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.employees.model import Employee
from app.seat_allocations.model import SeatAllocation
from app.seat_allocations.schema import SeatAllocationCreate
from app.seats.model import Seat


class SeatAllocationRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, allocation_data: SeatAllocationCreate) -> SeatAllocation:
        allocation = SeatAllocation(**allocation_data.model_dump(), is_active=True)
        self.db.add(allocation)
        self.db.commit()
        self.db.refresh(allocation)
        return allocation

    def get_by_id(self, allocation_id: int) -> SeatAllocation | None:
        return self.db.get(SeatAllocation, allocation_id)

    def get_employee(self, employee_id: int) -> Employee | None:
        return self.db.get(Employee, employee_id)

    def get_seat(self, seat_id: int) -> Seat | None:
        return self.db.get(Seat, seat_id)

    def get_active_by_employee(self, employee_id: int) -> SeatAllocation | None:
        statement = select(SeatAllocation).where(
            SeatAllocation.employee_id == employee_id,
            SeatAllocation.is_active.is_(True),
        )
        return self.db.scalar(statement)

    def get_active_by_seat(self, seat_id: int) -> SeatAllocation | None:
        statement = select(SeatAllocation).where(
            SeatAllocation.seat_id == seat_id,
            SeatAllocation.is_active.is_(True),
        )
        return self.db.scalar(statement)

    def get_by_employee(self, employee_id: int) -> list[SeatAllocation]:
        statement = (
            select(SeatAllocation)
            .where(SeatAllocation.employee_id == employee_id)
            .order_by(SeatAllocation.id)
        )
        return list(self.db.scalars(statement).all())

    def release(self, allocation: SeatAllocation) -> SeatAllocation:
        allocation.released_at = datetime.now(timezone.utc)
        allocation.is_active = False
        self.db.commit()
        self.db.refresh(allocation)
        return allocation
