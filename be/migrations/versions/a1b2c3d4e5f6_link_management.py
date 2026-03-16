"""link-management

Revision ID: a1b2c3d4e5f6
Revises: 0b1fa044fb43
Create Date: 2026-03-16 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
import sqlmodel


revision = "a1b2c3d4e5f6"
down_revision = "0b1fa044fb43"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # UTM fields on link
    op.add_column("link", sa.Column("utm_source", sa.String(), nullable=True))
    op.add_column("link", sa.Column("utm_medium", sa.String(), nullable=True))
    op.add_column("link", sa.Column("utm_campaign", sa.String(), nullable=True))
    op.add_column("link", sa.Column("utm_term", sa.String(), nullable=True))
    op.add_column("link", sa.Column("utm_content", sa.String(), nullable=True))

    # device field on click
    op.add_column(
        "click",
        sa.Column("device", sa.String(), nullable=False, server_default="unknown"),
    )

    # linktag junction table
    op.create_table(
        "linktag",
        sa.Column(
            "link_id",
            sqlmodel.sql.sqltypes.GUID(),
            sa.ForeignKey("link.id"),
            primary_key=True,
        ),
        sa.ForeignKeyConstraint(["link_id"], ["link.id"], ondelete="CASCADE"),
        sa.Column("tag", sa.String(), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("linktag")
    op.drop_column("click", "device")
    op.drop_column("link", "utm_content")
    op.drop_column("link", "utm_term")
    op.drop_column("link", "utm_campaign")
    op.drop_column("link", "utm_medium")
    op.drop_column("link", "utm_source")
