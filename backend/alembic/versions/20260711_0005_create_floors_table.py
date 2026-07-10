"""create floors table

Revision ID: 20260711_0005
Revises: 20260711_0004
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0005"
down_revision: str | None = "20260711_0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "floors",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_floors_id"), "floors", ["id"], unique=False)
    op.create_index(op.f("ix_floors_name"), "floors", ["name"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_floors_name"), table_name="floors")
    op.drop_index(op.f("ix_floors_id"), table_name="floors")
    op.drop_table("floors")
