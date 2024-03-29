"""hashed otp in schema

Revision ID: 66ea35490d30
Revises: 6636fd58763a
Create Date: 2023-07-02 22:42:16.247753

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = "66ea35490d30"
down_revision = "6636fd58763a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "session",
        sa.Column("hashed_otp", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("session", "hashed_otp")
    # ### end Alembic commands ###
