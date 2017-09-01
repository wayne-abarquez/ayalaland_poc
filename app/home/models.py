from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry


class BoundaryTable(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    typeid = db.Column(db.Integer, db.ForeignKey('boundary_type.id'), nullable=False)
    parentid = db.Column(db.Integer, db.ForeignKey('boundary_table.id'), nullable=False)
    name = db.Column(db.String(500))
    shortname = db.Column(db.String(250))
    geometry = db.Column(Geometry('Geometry'))
    geometry2 = db.Column(Geometry('Geometry'))
    is_favorite = db.Column(db.Boolean, default=False)
    has_data = db.Column(db.Boolean, default=False)


class BoundaryType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)


class Lots(BaseModel):
    lot_offer_no = db.Column(db.Integer, unique=True)
    boundaryid = db.Column(db.Integer, db.ForeignKey('boundary_table.id'))
    geom = db.Column(Geometry('Geometry'))
    complete_address = db.Column(db.String(500))
    owner_firstname = db.Column(db.String(200))
    owner_lastname = db.Column(db.String(200))
    date_offered = db.Column(db.Date)
    estate_name = db.Column(db.String(200))
    project_name = db.Column(db.String(200))
    sbu = db.Column(db.String(20))
    total_land_value = db.Column(db.Numeric)
    total_value_of_ali_owned = db.Column(db.Numeric)
    lot_status = db.Column(db.String(100), default='ACTIVE')
    legal_status = db.Column(db.String(100), default='OK')
    technical_status = db.Column(db.String(100), default='OK')


class LotDetails(BaseModel):
    lotid = db.Column(db.Integer, db.ForeignKey('lots.id'), nullable=False)
    metro_growth_center = db.Column(db.String(200))
    acquiring_entity = db.Column(db.String(200))
    year_signed = db.Column(db.SmallInteger)
    total_acquired_land_area = db.Column(db.Numeric)
    parcel_type = db.Column(db.String(100))
    rawland_developed = db.Column(db.String(200))
    efficiency = db.Column(db.Numeric)
    gross_developable = db.Column(db.Numeric)
    acqui_price_per_sqm = db.Column(db.Numeric)
    cost_to_complete = db.Column(db.Numeric)
    gfa = db.Column(db.Numeric)
    ali_share_on_land = db.Column(db.Numeric)
    ali_owned_in_has = db.Column(db.Numeric)
    far = db.Column(db.Numeric)
    av = db.Column(db.Numeric)


class LotLandbank(BaseModel):
    lotid = db.Column(db.Integer, db.ForeignKey('lots.id'), nullable=False)
    landbank_year = db.Column(db.SmallInteger)
    landbank_value = db.Column(db.Numeric)


class LotAcquiredLaunches(BaseModel):
    lotid = db.Column(db.Integer, db.ForeignKey('lots.id'), nullable=False)
    year = db.Column(db.SmallInteger)
    acquired = db.Column(db.Numeric)
    launches = db.Column(db.Numeric)
    ytd_landbank = db.Column(db.Numeric)


class LotLegalIssues(BaseModel):
    lotid = db.Column(db.Integer, db.ForeignKey('lots.id'), nullable=False)
    userid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(100), default='OPEN')
    datetime_reported = db.Column(db.DateTime, default=db.func.current_timestamp())
    action_item = db.Column(db.Text)


class LotTechnicalIssues(BaseModel):
    lotid = db.Column(db.Integer, db.ForeignKey('lots.id'), nullable=False)
    userid = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(100), default='OPEN')
    datetime_reported = db.Column(db.DateTime, default=db.func.current_timestamp())
    action_item = db.Column(db.Text)
