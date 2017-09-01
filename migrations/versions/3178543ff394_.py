"""empty message

Revision ID: 3178543ff394
Revises: None
Create Date: 2017-06-13 11:12:21.470313

"""

# revision identifiers, used by Alembic.
revision = '3178543ff394'
down_revision = None

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('mv_bbtech_dp', 'geomid')
    op.drop_column('mv_bbtech_dp', 'dp_type')
    op.drop_column('mv_bbtech_dp', 'name')
    op.drop_column('mv_bbtech_dp', 'port_util')
    op.drop_column('mv_bbtech_dp', 'd_bandw')
    op.drop_column('mv_bbtech_dp', 'cabinet')
    op.drop_column('mv_bbtech_dp', 'n_bandw')
    op.drop_column('mv_bbtech_dp', 'ftype')
    op.drop_column('mv_bbtech_dp', 's_util')
    op.drop_column('mv_bbtech_dp', 'd_unit')
    op.drop_column('mv_bbtech_dp', 'n_unit')
    op.drop_column('mv_bbtech_dp', 'n_util')
    op.drop_column('mv_bbtech_dp', 'cv25')
    op.drop_column('mv_bbtech_dp', 'p_util')
    op.drop_column('mv_bbtech_dp', 'cv26')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('mv_bbtech_dp', sa.Column('cv26', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('p_util', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('cv25', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('n_util', sa.NUMERIC(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('n_unit', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('d_unit', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('s_util', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('ftype', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('n_bandw', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('cabinet', sa.VARCHAR(length=500), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('d_bandw', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('port_util', sa.NUMERIC(), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('name', sa.VARCHAR(length=500), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('dp_type', sa.VARCHAR(length=250), autoincrement=False, nullable=True))
    op.add_column('mv_bbtech_dp', sa.Column('geomid', sa.BIGINT(), autoincrement=False, nullable=True))
    ### end Alembic commands ###
