"""create seat allocations table

Revision ID: 20260711_0009
Revises: 20260711_0008
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0009"
down_revision: str | None = "20260711_0008"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "seat_allocations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), nullable=False),
        sa.Column("seat_id", sa.Integer(), nullable=False),
        sa.Column("allocated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("released_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.ForeignKeyConstraint(["employee_id"], ["employees.id"]),
        sa.ForeignKeyConstraint(["seat_id"], ["seats.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_seat_allocations_employee_id"), "seat_allocations", ["employee_id"], unique=False)
    op.create_index(op.f("ix_seat_allocations_id"), "seat_allocations", ["id"], unique=False)
    op.create_index(op.f("ix_seat_allocations_seat_id"), "seat_allocations", ["seat_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_seat_allocations_seat_id"), table_name="seat_allocations")
    op.drop_index(op.f("ix_seat_allocations_id"), table_name="seat_allocations")
    op.drop_index(op.f("ix_seat_allocations_employee_id"), table_name="seat_allocations")
    op.drop_table("seat_allocations")
