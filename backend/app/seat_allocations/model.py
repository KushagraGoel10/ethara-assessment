from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.employees.model import Employee
from app.seats.model import Seat


class SeatAllocation(Base):
    __tablename__ = "seat_allocations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id"), nullable=False, index=True)
    allocated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="true")

    employee: Mapped[Employee] = relationship()
    seat: Mapped[Seat] = relationship()
