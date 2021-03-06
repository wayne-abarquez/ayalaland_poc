"""empty message

Revision ID: 4c801926d995
Revises: 49814f37e914
Create Date: 2017-09-05 09:24:56.439684

"""

# revision identifiers, used by Alembic.
revision = '4c801926d995'
down_revision = '49814f37e914'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('lots', 'project_name',
                    existing_type=sa.String(length=200),
                    nullable=False, server_default='Unnamed Project')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('lots', 'project_name',
                    existing_type=sa.String(length=200),
                    nullable=True)
    ### end Alembic commands ###
