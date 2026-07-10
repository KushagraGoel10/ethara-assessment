"""create project assignments table

Revision ID: 20260711_0008
Revises: 20260711_0007
Create Date: 2026-07-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260711_0008"
down_revision: str | None = "20260711_0007"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "project_assignments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employee_id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("assigned_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.ForeignKeyConstraint(["employee_id"], ["employees.id"]),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_project_assignments_employee_id"), "project_assignments", ["employee_id"], unique=False)
    op.create_index(op.f("ix_project_assignments_id"), "project_assignments", ["id"], unique=False)
    op.create_index(op.f("ix_project_assignments_project_id"), "project_assignments", ["project_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_project_assignments_project_id"), table_name="project_assignments")
    op.drop_index(op.f("ix_project_assignments_id"), table_name="project_assignments")
    op.drop_index(op.f("ix_project_assignments_employee_id"), table_name="project_assignments")
    op.drop_table("project_assignments")
