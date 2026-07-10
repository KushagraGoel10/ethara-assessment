"""create zones table

Revision ID: 20260711_0006
Revises: 20260711_0005
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0006"
down_revision: str | None = "20260711_0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "zones",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("floor_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["floor_id"], ["floors.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("floor_id", "name", name="uq_zones_floor_id_name"),
    )
    op.create_index(op.f("ix_zones_floor_id"), "zones", ["floor_id"], unique=False)
    op.create_index(op.f("ix_zones_id"), "zones", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_zones_id"), table_name="zones")
    op.drop_index(op.f("ix_zones_floor_id"), table_name="zones")
    op.drop_table("zones")
