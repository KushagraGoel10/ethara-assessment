"""create teams table

Revision ID: 20260711_0003
Revises: 20260711_0002
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0003"
down_revision: str | None = "20260711_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("department_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["department_id"], ["departments.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("department_id", "name", name="uq_teams_department_id_name"),
    )
    op.create_index(op.f("ix_teams_department_id"), "teams", ["department_id"], unique=False)
    op.create_index(op.f("ix_teams_id"), "teams", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_teams_id"), table_name="teams")
    op.drop_index(op.f("ix_teams_department_id"), table_name="teams")
    op.drop_table("teams")
