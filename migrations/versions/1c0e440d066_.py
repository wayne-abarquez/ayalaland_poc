"""empty message

Revision ID: 1c0e440d066
Revises: None
Create Date: 2017-09-01 17:12:30.540505

"""

# revision identifiers, used by Alembic.
revision = '1c0e440d066'
down_revision = None

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('roleid', sa.Integer(), nullable=True),
    sa.Column('firstname', sa.String(length=200), nullable=True),
    sa.Column('lastname', sa.String(length=200), nullable=True),
    sa.Column('username', sa.String(length=50), nullable=True),
    sa.Column('password_hash', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['roleid'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lots',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lot_offer_no', sa.Integer(), nullable=True),
    sa.Column('boundaryid', sa.Integer(), nullable=True),
    sa.Column('geom', geoalchemy2.types.Geometry(), nullable=True),
    sa.Column('complete_address', sa.String(length=500), nullable=True),
    sa.Column('owner_firstname', sa.String(length=200), nullable=True),
    sa.Column('owner_lastname', sa.String(length=200), nullable=True),
    sa.Column('date_offered', sa.Date(), nullable=True),
    sa.Column('estate_name', sa.String(length=200), nullable=True),
    sa.Column('project_name', sa.String(length=200), nullable=True),
    sa.Column('sbu', sa.String(length=20), nullable=True),
    sa.Column('total_land_value', sa.Numeric(), nullable=True),
    sa.Column('total_value_of_ali_owned', sa.Numeric(), nullable=True),
    sa.Column('lot_status', sa.String(length=100), nullable=True, server_default='ACTIVE'),
    sa.Column('legal_status', sa.String(length=100), nullable=True, server_default='OK'),
    sa.Column('technical_status', sa.String(length=100), nullable=True, server_default='OK'),
    sa.ForeignKeyConstraint(['boundaryid'], ['boundary_table.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('lot_offer_no')
    )
    op.create_table('lot_acquired_launches',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lotid', sa.Integer(), nullable=False),
    sa.Column('year', sa.SmallInteger(), nullable=True),
    sa.Column('acquired', sa.Numeric(), nullable=True),
    sa.Column('launches', sa.Numeric(), nullable=True),
    sa.Column('ytd_landbank', sa.Numeric(), nullable=True),
    sa.ForeignKeyConstraint(['lotid'], ['lots.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lot_details',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lotid', sa.Integer(), nullable=False),
    sa.Column('metro_growth_center', sa.String(length=200), nullable=True),
    sa.Column('acquiring_entity', sa.String(length=200), nullable=True),
    sa.Column('year_signed', sa.SmallInteger(), nullable=True),
    sa.Column('total_acquired_land_area', sa.Numeric(), nullable=True),
    sa.Column('parcel_type', sa.String(length=100), nullable=True),
    sa.Column('rawland_developed', sa.String(length=200), nullable=True),
    sa.Column('efficiency', sa.Numeric(), nullable=True),
    sa.Column('gross_developable', sa.Numeric(), nullable=True),
    sa.Column('acqui_price_per_sqm', sa.Numeric(), nullable=True),
    sa.Column('cost_to_complete', sa.Numeric(), nullable=True),
    sa.Column('gfa', sa.Numeric(), nullable=True),
    sa.Column('ali_share_on_land', sa.Numeric(), nullable=True),
    sa.Column('ali_owned_in_has', sa.Numeric(), nullable=True),
    sa.Column('far', sa.Numeric(), nullable=True),
    sa.Column('av', sa.Numeric(), nullable=True),
    sa.ForeignKeyConstraint(['lotid'], ['lots.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lot_landbank',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lotid', sa.Integer(), nullable=False),
    sa.Column('landbank_year', sa.SmallInteger(), nullable=True),
    sa.Column('landbank_value', sa.Numeric(), nullable=True),
    sa.ForeignKeyConstraint(['lotid'], ['lots.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lot_legal_issues',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lotid', sa.Integer(), nullable=False),
    sa.Column('userid', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=100), nullable=True, server_default='OPEN'),
    sa.Column('datetime_reported', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
    sa.Column('action_item', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['lotid'], ['lots.id'], ),
    sa.ForeignKeyConstraint(['userid'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lot_technical_issues',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('date_modified', sa.DateTime(), nullable=True, server_default=sa.func.current_timestamp()),
    sa.Column('lotid', sa.Integer(), nullable=False),
    sa.Column('userid', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=100), nullable=True, server_default='OPEN'),
    sa.Column('datetime_reported', sa.DateTime(), nullable=False, server_default=sa.func.current_timestamp()),
    sa.Column('action_item', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['lotid'], ['lots.id'], ),
    sa.ForeignKeyConstraint(['userid'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('lot_technical_issues')
    op.drop_table('lot_legal_issues')
    op.drop_table('lot_landbank')
    op.drop_table('lot_details')
    op.drop_table('lot_acquired_launches')
    op.drop_table('lots')
    op.drop_table('users')
    op.drop_table('roles')
    ### end Alembic commands ###