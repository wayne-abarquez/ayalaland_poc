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

dp_fields = dict(
    facility=fields.String,
    geom=PointToLatLng(attribute='geom')
)

grdp_fields = dict(
    type=fields.String,
    boundaryid=fields.Integer,
    boundary=fields.String,
    year=fields.Integer,
    amount=fields.Float
)

boundary_circle_fields = dict(
    id=fields.Integer,
    name=fields.String,
    type=fields.String,
    radius=fields.Integer,
    center=PointToLatLng(attribute='center'),
    geometry=PolygonToLatLng(attribute='geometry'),
    geometry2=PolygonToLatLng(attribute='geometry2'),
    places=fields.Raw,
    facilities=fields.List(fields.Nested(dp_fields)),
    population=fields.Integer,
    grdp=fields.List(fields.Nested(grdp_fields))
)

boundary_complete_fields = copy(boundary_fields)
# boundary_complete_fields['type'] = fields.Nested(boundary_type_fields)
boundary_complete_fields['geometry'] = PolygonToLatLng(attribute='geometry')
boundary_complete_fields['geometry2'] = PolygonToLatLng(attribute='geometry2')

