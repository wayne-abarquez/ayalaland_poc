from app.home.models import BoundaryTable, BoundaryType, Lots
from .exceptions import BoundaryNotFound
from sqlalchemy import func, select
from sqlalchemy.sql.expression import join
from app import db
import shapefile
import zipfile
import StringIO
import logging
import shapely
import os
from app import app, db
from werkzeug import secure_filename
from shapely.geometry import shape
from app.utils.forms_helper import parse_area


log = logging.getLogger(__name__)


def get_boundaries(parentid=None):
    if parentid is None:
        return BoundaryTable.query.filter(BoundaryTable.typeid == 3).order_by(BoundaryTable.id).all()
    else:
        return BoundaryTable.query.filter(BoundaryTable.parentid == parentid).order_by(BoundaryTable.id).all()


def get_boundaries_by_type(typeid):
    return BoundaryTable.query.filter(BoundaryTable.typeid == typeid).order_by(BoundaryTable.id).all()


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


def get_lots():
    return Lots.query.all()


def upload_shape_file(file):
    filename = secure_filename(file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)

    zipshape = zipfile.ZipFile(file)
    cpgname, dbfname, prjname, sbnname, sbxname, shpname, shxname = zipshape.namelist()
    cloudshp = StringIO.StringIO(zipshape.read(shpname))
    cloudshx = StringIO.StringIO(zipshape.read(shxname))
    clouddbf = StringIO.StringIO(zipshape.read(dbfname))
    shape = shapefile.Reader(shp=cloudshp, shx=cloudshx, dbf=clouddbf)
    print shape.__dict__
    # print shape.bbox
    shapes = shape.shapeRecords()

    for poly in shapes:
        # print type(poly.shape.__geo_interface__)
        # shp_geom = shape(first)
        first = poly.shape.points
        record = poly.record
        lot_sheet_no = record[0]
        project_name = record[1]
        # print poly.__dict__
        print "lot sheet no: {0} project name: {1}".format(lot_sheet_no, project_name)
        shp_geom = parse_area(first, True)

        lot = Lots(project_name=record[1], geom=shp_geom)
        db.session.add(lot)
        db.session.commit()


def create_lot_offer(data):
    # Prepare Data
    lot = Lots.from_dict(data)
    lot.geom = parse_area(data['area'])

    if 'city' in data:
        lot.boundaryid = data['city']
    elif 'province' in data:
        lot.boundaryid = data['province']
    elif 'region' in data:
        lot.boundaryid = data['region']

    # Persist
    db.session.add(lot)
    db.session.commit()

    return lot
