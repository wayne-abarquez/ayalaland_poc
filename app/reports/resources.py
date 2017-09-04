from flask.ext.restful import Resource, marshal_with, marshal, abort
from app import rest_api
from flask import request
from .fields import landbank_inventory_fields, issues_fields, landbank_inventory_gis_fields
from .services import get_issues_by_type, get_landbank_inventory_gis
from app.home.services import get_landbank_inventory


class IssuesResource(Resource):
    """
    Resource for getting Lot Details
    """

    @marshal_with(issues_fields)
    def get(self):
        """ GET /issues """
        print request.args['type']

        if 'type' not in request.args:
            return []

        return get_issues_by_type(request.args['type'])


class LandBankInventoryResource(Resource):
    """
    Resource for getting Lot Details
    """

    @marshal_with(landbank_inventory_fields)
    def get(self):
        """ GET /lots/landbank-inventory """
        if 'sbu' not in request.args:
            return []

        return get_landbank_inventory(request.args['sbu'])


class LandBankInventoryGISResource(Resource):
    """
    Resource for getting Landbank Inventory via GIS
    """

    @marshal_with(landbank_inventory_gis_fields)
    def get(self):
        """ GET /lots/landbank-inventory-gis """
        return get_landbank_inventory_gis()


rest_api.add_resource(IssuesResource, '/api/issues')
rest_api.add_resource(LandBankInventoryResource, '/api/lots/landbank-inventory')
rest_api.add_resource(LandBankInventoryGISResource, '/api/lots/landbank-inventory-gis')
