from app.home.models import BoundaryTable, BoundaryType, MvBBTechDP, BoundaryPopulation, Grdp, GrdpType
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

place_types_category = [
    'establishment',
    'restaurant',
    'hospital',
    'airport',
    'bank',
    'church',
    'school',
    'shopping_mall',
    'museum',
    'park',
    'lodging',
    'cafe'
    # 'store',
    # 'food',
    # 'point_of_interest',
    # 'bar',
]


def get_boundaries(parentid=None):
    if parentid is None:
        return BoundaryTable.query.filter(BoundaryTable.typeid == 3).order_by(BoundaryTable.id).all()
    else:
        return BoundaryTable.query.filter(BoundaryTable.parentid == parentid).order_by(BoundaryTable.id).all()


def get_favorite_boundaries():
    return BoundaryTable.query.filter(BoundaryTable.is_favorite == True).order_by(BoundaryTable.id).all()


def get_boundary_detail(boundary_id):
    boundary = BoundaryTable.query.get(boundary_id)

    if boundary is None:
        raise BoundaryNotFound("Boundary id={0} not found".format(boundary_id))

    return boundary


def get_boundary_minimum_circle(boundary_id):
    stmt = select([BoundaryTable,
                   BoundaryType.name.label('type'),
                   (func.ST_Centroid(BoundaryTable.geometry)).label('center'),
                   (func.ST_Perimeter(func.ST_Buffer(BoundaryTable.geometry, (
                       func.ST_Perimeter(BoundaryTable.geometry) / (func.pi() * 2) / 1.5)), False) / (
                    func.pi() * 2)).label(
                       'radius'),
                   (func.ST_AsGeoJSON(BoundaryTable.geometry)).label('polyjson')
                   ]) \
        .select_from(join(BoundaryTable, BoundaryType, BoundaryTable.typeid == BoundaryType.id)) \
        .where(BoundaryTable.id == boundary_id)

    result = db.session.execute(stmt).fetchone()

    return result


# def get_boundary_minimum_circle(boundary_id):
#
#     result = db.session.query(BoundaryTable,
#                    BoundaryType.name.label('type'),
#                   (func.ST_Centroid(BoundaryTable.geometry)).label('center'),
#                   (func.ST_Perimeter(func.ST_Buffer(BoundaryTable.geometry, (func.ST_Perimeter(BoundaryTable.geometry) / (func.pi() * 2) / 1.5)), False) / (func.pi() * 2)).label('radius'),
#                   (func.ST_AsGeoJSON(BoundaryTable.geometry)).label('polyjson'),
#                    BoundaryPopulation.population.label('population')
#                    ) \
#         .select_from(BoundaryTable) \
#         .join((BoundaryType, BoundaryTable.typeid==BoundaryType.id)) \
#         .join((BoundaryPopulation, BoundaryTable.id==BoundaryPopulation.boundaryid)) \
#         .filter(BoundaryTable.id == boundary_id) \
#         .first()
#
#     print dict(result)
#
#     if result is None:
#         return result
#
#     return result


def attach_next_page_token(item, token):
    item['next_page_token'] = token
    return item


def get_poi_by_boundary(boundary_id, data, results, place_type=None, nextpagetoken=None):
    center = PointToLatLng().format(data.center)

    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBFWjwGDIZEqIJQLwI8yFpK76_KgLymr8E'
    url += '&location=' + str(center['lat']) + ',' + str(center['lng'])
    url += '&radius=' + str(data.radius)

    if place_type is not None:
        url += '&type=' + place_type

    if nextpagetoken is not None:
        url += '&pagetoken=' + nextpagetoken

    # print url

    response = requests.get(url, verify=False)
    if response.content:
        content = json.loads(response.content)
        if 'results' in content:
            # print 'results length: {0}'.format(len(content['results']))
            if 'next_page_token' in content:
                results += map(lambda item: attach_next_page_token(item, content['next_page_token']),
                               content['results'])
            else:
                results += content['results']

        if 'next_page_token' in content and content['next_page_token'] is not None:
            # print 'GO TO NEXT PAGE Token: {0}'.format(content['next_page_token'])
            return get_poi_by_boundary(boundary_id, data, results, place_type, content['next_page_token'])

    return results


def get_poi_type(types, place_types_list=None):
    type = 'establishment'

    type_selection = place_types_category if place_types_list is None else place_types_list

    for place_type in type_selection:
        for inner_type in types:
            if place_type == inner_type:
                type = place_type
                break
    return type
    # intersect = sorted(list(set(place_types_category).intersection(types)))
    # return intersect[0] if len(intersect) > 0 else 'point_of_interest'


def filter_pois(poly_data, pois, place_types_list):
    data = {}

    shape = shapely.geometry.shape(json.loads(poly_data))

    for item in pois:
        if is_within(item['geometry']['location'], shape):
            # item['type'] = str(item['types'][0]) if len(item['types']) else ''
            item['type'] = get_poi_type(item['types'], place_types_list)

            if item['type'] not in data:
                data[item['type']] = []

            data[item['type']].append(item)

    return data


def is_within(point_data, shape):
    point = shapely.geometry.Point(point_data['lng'], point_data['lat'])

    return shape.contains(point)


def get_geometry_by_boundary(boundary_id):
    stmt = select([BoundaryTable.geometry]) \
        .select_from(BoundaryTable) \
        .where(BoundaryTable.id == boundary_id) \
        .alias('boundary')

    return stmt


def get_dps_by_boundary(boundary_id):
    boundary = get_geometry_by_boundary(boundary_id)

    # stmt = select([MvBBTechDP.cabinet,
    #                MvBBTechDP.dpname,
    #                MvBBTechDP.name,
    #                MvBBTechDP.dp_type,
    #                MvBBTechDP.geom
    #                ]) \
    stmt = select([MvBBTechDP.dpname.label('facility'),
                   MvBBTechDP.geom
                   ]) \
        .select_from(MvBBTechDP) \
        .where(func.ST_DWithin(boundary.c.geometry, MvBBTechDP.geom, 0))

    result = db.session.execute(stmt).fetchall()

    return result


def get_population_by_boundary(boundaryid):
    return BoundaryPopulation.query.filter(BoundaryPopulation.boundaryid == boundaryid).first()


def get_grdp_data(boundaryid):
    stm = db.session.query(Grdp.typeid.label('typeid'), GrdpType.name.label('type'), Grdp.boundaryid.label('boundaryid'), BoundaryTable.name.label('name'), Grdp.year.label('year'), Grdp.amount.label('amount')).\
        join(GrdpType).\
        join(BoundaryTable).\
        filter(Grdp.boundaryid==boundaryid).\
        order_by(Grdp.typeid, Grdp.year).\
        all()

    result = []

    for item in stm:
        result.append({'type': item[1], 'boundaryid': item[2], 'boundary': item[3], 'year': item[4], 'amount': item[5]})

    return result


def get_region(brgy_id):
    brgy = BoundaryTable.query.get(brgy_id)
    if brgy is not None:
        city = BoundaryTable.query.get(brgy.parentid)
        if city is not None:
            prov = BoundaryTable.query.get(city.parentid)
            return prov.parentid

    return None


def get_places_by_boundary(place_types, boundary_id):
    result = get_boundary_minimum_circle(boundary_id)

    data = dict(result)

    mod = BoundaryTable.from_dict(data, ['center', 'radius', 'type', 'population'])

    results = []
    place_types_list = place_types.split('|')
    for placetype in place_types_list:
        results += get_poi_by_boundary(boundary_id, mod, [], placetype)

    dps = get_dps_by_boundary(boundary_id)

    filtered = filter_pois(data['polyjson'], results, place_types_list)

    population = get_population_by_boundary(boundary_id)
    population_data = '0' if population is None else population.population

    setattr(mod, 'population', population_data)

    regionid = get_region(boundary_id)
    grdp_data = [] if regionid is None else list(get_grdp_data(regionid))

    setattr(mod, 'grdp', grdp_data)
    setattr(mod, 'facilities', dps)
    setattr(mod, 'places', filtered)

    return mod
