from app.home.models import BoundaryTable, BoundaryType
from .exceptions import BoundaryNotFound
from sqlalchemy import func, select
from sqlalchemy.sql.expression import join
from app import db
from app.utils.gis_json_fields import PointToLatLng
import logging
import json
import requests
import shapely

log = logging.getLogger(__name__)


def get_boundaries(parentid=None):
    if parentid is None:
        return BoundaryTable.query.filter(BoundaryTable.typeid == 3).order_by(BoundaryTable.id).all()
    else:
        return BoundaryTable.query.filter(BoundaryTable.parentid == parentid).order_by(BoundaryTable.id).all()


def get_boundary_detail(boundary_id):
    boundary = BoundaryTable.query.get(boundary_id)

    if boundary is None:
        raise BoundaryNotFound("Boundary id={0} not found".format(boundary_id))

    return boundary


def get_boundary_minimum_circle(boundary_id):
    stmt = select([BoundaryTable,
                   BoundaryType.name.label('type'),
                   (func.ST_AsGeoJSON(BoundaryTable.geometry)).label('polyjson')
                   ]) \
        .select_from(join(BoundaryTable, BoundaryType, BoundaryTable.typeid == BoundaryType.id)) \
        .where(BoundaryTable.id == boundary_id)

    result = db.session.execute(stmt).fetchone()

    return result


def is_within(point_data, shape):
    point = shapely.geometry.Point(point_data['lng'], point_data['lat'])

    return shape.contains(point)


def get_geometry_by_boundary(boundary_id):
    stmt = select([BoundaryTable.geometry]) \
        .select_from(BoundaryTable) \
        .where(BoundaryTable.id == boundary_id) \
        .alias('boundary')

    return stmt


def get_region(brgy_id):
    brgy = BoundaryTable.query.get(brgy_id)
    if brgy is not None:
        city = BoundaryTable.query.get(brgy.parentid)
        if city is not None:
            prov = BoundaryTable.query.get(city.parentid)
            return prov.parentid

    return None


def get_places_by_boundary(boundary_id):
    result = get_boundary_minimum_circle(boundary_id)

    data = dict(result)

    return BoundaryTable.from_dict(data, ['type'])
