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
    geometry = db.Column(Geometry('POLYGON'))
    geometry2 = db.Column(Geometry('POLYGON'))
    is_favorite = db.Column(db.Boolean, default=False)
    has_data = db.Column(db.Boolean, default=False)


class BoundaryType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)


class MvBBTechDP(db.Model, OrmObject):
    __tablename__ = 'mv_bbtech_dp'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dpname = db.Column(db.String(500))
    geom = db.Column(Geometry('POINT'))


class BoundaryPopulation(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    boundaryid = db.Column(db.Integer, db.ForeignKey('boundary_table.id'), nullable=False)
    population = db.Column(db.Integer, nullable=False)


class GrdpType(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False)
    shortname = db.Column(db.String(200), nullable=False)


class Grdp(BaseModel):
    typeid = db.Column(db.Integer, db.ForeignKey('grdp_type.id'), nullable=False)
    boundaryid = db.Column(db.Integer, db.ForeignKey('boundary_table.id'), nullable=False)
    year = db.Column(db.SmallInteger, nullable=False)
    amount = db.Column(db.Numeric, nullable=False)

