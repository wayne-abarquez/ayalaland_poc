from flask.ext.restful import fields
from app.utils.gis_json_fields import PolygonToLatLng
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

lot_minimum_fields = dict(
    lot_offer_no=fields.Integer,
    boundaryid=fields.Integer,
    complete_address=fields.String,
    owner_firstname=fields.String,
    owner_lastname=fields.String,
    date_offered=fields.DateTime('iso8601'),
    estate_name=fields.String,
    project_name=fields.String,
    sbu=fields.String,
    lot_status=fields.String,
    legal_status=fields.String,
    technical_status=fields.String
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

lot_detail_fields = dict(
    id=fields.Integer,
    lotid=fields.Integer,
    metro_growth_center=fields.String,
    acquiring_entity=fields.String,
    year_signed=fields.Integer,
    total_acquired_land_area=fields.Float,
    parcel_type=fields.String,
    rawland_developed=fields.String,
    efficiency=fields.Float,
    gross_developable=fields.Float,
    acqui_price_per_sqm=fields.Float,
    cost_to_complete=fields.Float,
    gfa=fields.Float,
    ali_share_on_land=fields.Float,
    far=fields.Float,
    av=fields.Float
)

lot_landbank_fields = dict(
    id=fields.Integer,
    lotid=fields.Integer,
    landbank_year=fields.Integer,
    landbank_value=fields.Float
)

lot_acquired_launches_fields = dict(
    id=fields.Integer,
    lotid=fields.Integer,
    year=fields.Integer,
    acquired=fields.Float,
    launches=fields.Float,
    ytd_landbank=fields.Float
)

lot_offer_create_fields = dict(
    status=fields.String,
    message=fields.String,
    lot=fields.Nested(lot_fields, allow_null=False)
)

lot_issue_fields = dict(
    id=fields.Integer,
    lotid=fields.Integer,
    userid=fields.Integer,
    type=fields.String,
    description=fields.String,
    status=fields.String,
    action_item=fields.String,
    date_reported=fields.DateTime('iso8601')
)

lot_issue_create_fields = dict(
    status=fields.String,
    message=fields.String,
    issue=fields.Nested(lot_issue_fields, allow_null=False)
)

boundary_complete_fields = copy(boundary_fields)
boundary_complete_fields['type'] = fields.Nested(boundary_type_fields)
boundary_complete_fields['geometry'] = PolygonToLatLng(attribute='geometry')
boundary_complete_fields['geometry2'] = PolygonToLatLng(attribute='geometry2')

lot_complete_fields = copy(lot_fields)
lot_complete_fields['details'] = fields.Nested(lot_detail_fields, allow_null=True)
lot_complete_fields['landbank'] = fields.List(fields.Nested(lot_landbank_fields))
lot_complete_fields['acquired_launches'] = fields.List(fields.Nested(lot_acquired_launches_fields))
lot_complete_fields['issues'] = fields.List(fields.Nested(lot_issue_fields))
