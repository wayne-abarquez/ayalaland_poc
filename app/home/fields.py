from flask.ext.restful import fields
from app.utils.gis_json_fields import PolygonToLatLng, PointToLatLng
from copy import copy


success_fields = dict(
    status=fields.String,
    message=fields.String,
)

boundary_fields = dict(
    id=fields.Integer,
    typeid=fields.Integer,
    parentid=fields.Integer,
    name=fields.String,
    shortname=fields.String,
    has_data=fields.Boolean
)

boundary_type_fields = dict(
    name=fields.String
)

lot_fields = dict(
    id=fields.Integer,
    lot_offer_no=fields.Integer,
    boundaryid=fields.Integer,
    geom=PolygonToLatLng(attribute='geom'),
    complete_address=fields.String,
    owner_firstname=fields.String,
    owner_lastname=fields.String,
    date_offered=fields.DateTime('iso8601'),
    estate_name=fields.String,
    project_name=fields.String,
    sbu=fields.String,
    total_land_value=fields.Float,
    total_value_of_ali_owned=fields.Float,
    lot_status=fields.String,
    legal_status=fields.String,
    technical_status=fields.String
)

lot_offer_create_fields = dict(
    status=fields.String,
    message=fields.String,
    lot=fields.Nested(lot_fields, allow_null=False)
)

boundary_complete_fields = copy(boundary_fields)
boundary_complete_fields['type'] = fields.Nested(boundary_type_fields)
boundary_complete_fields['geometry'] = PolygonToLatLng(attribute='geometry')
boundary_complete_fields['geometry2'] = PolygonToLatLng(attribute='geometry2')

lot_complete_fields = copy(lot_fields)

