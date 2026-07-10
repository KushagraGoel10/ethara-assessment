"""create seats table

Revision ID: 20260711_0007
Revises: 20260711_0006
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0007"
down_revision: str | None = "20260711_0006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "seats",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("zone_id", sa.Integer(), nullable=False),
        sa.Column("seat_number", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("zone_id", "seat_number", name="uq_seats_zone_id_seat_number"),
    )
    op.create_index(op.f("ix_seats_id"), "seats", ["id"], unique=False)
    op.create_index(op.f("ix_seats_seat_number"), "seats", ["seat_number"], unique=False)
    op.create_index(op.f("ix_seats_zone_id"), "seats", ["zone_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_seats_zone_id"), table_name="seats")
    op.drop_index(op.f("ix_seats_seat_number"), table_name="seats")
    op.drop_index(op.f("ix_seats_id"), table_name="seats")
    op.drop_table("seats")
