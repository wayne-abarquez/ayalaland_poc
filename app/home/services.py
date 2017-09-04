from app.home.models import BoundaryTable, BoundaryType, Lots, LotIssues, LotStatus, LegalStatus, TechnicalStatus, LotDetails
from app.authentication.models import Users
from .exceptions import BoundaryNotFound
from sqlalchemy import func, select
from sqlalchemy.sql.expression import join
from geoalchemy2 import Geography
import shapefile
import zipfile
import StringIO
import logging
import shapely
import os
from app import app, db
from werkzeug import secure_filename
from app.utils.forms_helper import parse_area
from sqlalchemy.sql.expression import cast

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


def get_lot_details (lotid):
    return Lots.query.get(lotid)


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


def update_lot_offer(lotid, data):
    lot = Lots.query.get_or_404(lotid)

    if 'lot_status' in data:
        lot.lot_status = data['lot_status']

    if 'legal_status' in data:
        lot.legal_status = data['legal_status']

    if 'technical_status' in data:
        lot.technical_status = data['technical_status']

    if lot.legal_status == 'LDD IN PROGRESS' or lot.technical_status == 'TDD IN PROGRESS':
        lot.lot_status = 'DUE DILIGENCE IN PROGRESS'
    elif lot.legal_status == 'LDD COMPLETED' and lot.technical_status == 'TDD COMPLETED':
        lot.lot_status = 'DUE DILIGENCE COMPLETED'

    if 'estate_name' in data and data['estate_name'] != lot.estate_name:
        lot.estate_name = data['estate_name']

    if 'project_name' in data and data['project_name'] != lot.project_name:
        lot.project_name = data['project_name']

    if 'lot_offer_no' in data and data['lot_offer_no'] != lot.lot_offer_no:
        lot.lot_offer_no = data['lot_offer_no']

    if 'sbu' in data and data['sbu'] != lot.sbu:
        lot.sbu = data['sbu']

    if 'owner_firstname' in data and data['owner_firstname'] != lot.owner_firstname:
        lot.owner_firstname = data['owner_firstname']

    if 'owner_lastname' in data and data['owner_lastname'] != lot.owner_lastname:
        lot.owner_lastname = data['owner_lastname']

    db.session.commit()

    return lot


def filter_lots(filter_data):
    boundaryid = None

    query = Lots.query

    if 'city' in filter_data:
        boundaryid = filter_data['city']
    elif 'province' in filter_data:
        boundaryid = filter_data['province']
    elif 'region' in filter_data:
        boundaryid = filter_data['region']

    if boundaryid is not None:
        subq = db.session.query(BoundaryTable.geometry.label('bounds')).filter(BoundaryTable.id == boundaryid).subquery()
        query = query.filter(func.ST_Intersects(cast(subq.c.bounds, Geography), cast(Lots.geom, Geography)))

    if 'lot_status' in filter_data:
        query = query.filter(Lots.lot_status == filter_data['lot_status'])

    if 'date_start' in filter_data and 'date_end' in filter_data:
        query = query.filter(Lots.date_offered.between(filter_data['date_start'], filter_data['date_end']))

    if 'sbu' in filter_data:
        query = query.filter(Lots.sbu == filter_data['sbu'])

    return query.all()


def create_lot_issue(lotid, userid, data):
    user = Users.query.get_or_404(userid)
    lot = Lots.query.get_or_404(lotid)

    if user.role.name == 'LEGAL':
        if lot.legal_status == LegalStatus.LDD_COMPLETED:
            lot.lot_status = LotStatus.DUE_DILIGENCE_COMPLETED
        else:
            lot.lot_status = LotStatus.DUE_DILIGENCE_IN_PROGRESS

        lot.legal_status = LegalStatus.WITH_ISSUE
        type = 'LEGAL'
    elif user.role.name == 'MDC':
        if lot.technical_status == TechnicalStatus.TDD_COMPLETED:
            lot.lot_status = LotStatus.DUE_DILIGENCE_COMPLETED
        else:
            lot.lot_status = LotStatus.DUE_DILIGENCE_IN_PROGRESS

        lot.technical_status = TechnicalStatus.WITH_ISSUE
        type = 'TECHNICAL'

    issue = LotIssues.from_dict(data)
    issue.lotid = lotid
    issue.userid = userid

    if type:
        issue.type = type

    # Persist
    db.session.add(issue)
    db.session.commit()

    return issue


def get_landbank_inventory(sbu):
    result = db.session.query(
        Lots.sbu,
        Lots.total_land_value,
        Lots.total_value_of_ali_owned,
        LotDetails.lotid,
        LotDetails.gfa,
        Lots.id,
        Lots.project_name
    ).join(LotDetails, Lots.id == LotDetails.lotid)\
        .filter(Lots.sbu == sbu.upper()).all()

    return map(lambda item : {'sbu': item[0], 'total_land_value': item[1], 'total_value_of_ali_owned': item[2], 'lotid': item[3], 'gfa': item[4], 'lot_offer_no': item[5], 'project_name': item[6]}, result)
