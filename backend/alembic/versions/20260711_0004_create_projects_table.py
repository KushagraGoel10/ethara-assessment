"""create projects table

Revision ID: 20260711_0004
Revises: 20260711_0003
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0004"
down_revision: str | None = "20260711_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_projects_code"), "projects", ["code"], unique=True)
    op.create_index(op.f("ix_projects_id"), "projects", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_projects_id"), table_name="projects")
    op.drop_index(op.f("ix_projects_code"), table_name="projects")
    op.drop_table("projects")
