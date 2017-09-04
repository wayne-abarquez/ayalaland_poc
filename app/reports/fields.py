from flask.ext.restful import fields
from app.home.fields import lot_issue_fields, lot_minimum_fields
from app.utils.gis_json_fields import PolygonToLatLng, PointToLatLng
from copy import copy


landbank_inventory_fields = dict(
    lotid=fields.Integer,
    sbu=fields.String,
    total_land_value=fields.Float,
    total_value_of_ali_owned=fields.Float,
    gfa=fields.Float,
    lot_offer_no=fields.Integer,
    project_name=fields.String
)

landbank_inventory_gis_fields = dict(
    id=fields.Integer,
    lot_offer_no=fields.Integer,
    estate_name=fields.String,
    project_name=fields.String,
    complete_address=fields.String,
    sbu=fields.String,
    lot_status=fields.String,
    center=PointToLatLng(attribute='center'),
    geom=PolygonToLatLng(attribute='geom')
)

issues_fields = copy(lot_issue_fields)
issues_fields['lot'] = fields.Nested(lot_minimum_fields)
