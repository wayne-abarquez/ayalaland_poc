from flask.ext.restful import Resource, marshal_with
from .fields import boundary_fields, boundary_complete_fields, boundary_circle_fields
from app import rest_api
from app.home.services import get_boundaries, get_boundary_detail, get_boundary_minimum_circle, get_places_by_boundary
import logging
from flask import request

log = logging.getLogger(__name__)


class BoundaryResource(Resource):
    """
    Resource for getting all Boundary
    """

    @marshal_with(boundary_fields)
    def get(self):
        """ GET /boundaries """

        parent_id = request.args['parent_id'] if 'parent_id' in request.args else None

        return get_boundaries(parent_id)


class BoundaryDetailResource(Resource):
    """
    Resource for getting Boundary details
    """
    @marshal_with(boundary_complete_fields)
    def get(self, boundaryid):
        """ GET /boundaries/<int:boundaryid> """
        return get_boundary_detail(boundaryid)


class BoundaryDetailCircleResource(Resource):
    """
    Resource for getting Boundary circle
    """

    @marshal_with(boundary_complete_fields)
    def get(self, boundaryid):
        """ GET /boundaries/<int:boundaryid>/circle """
        return get_places_by_boundary(boundaryid)


rest_api.add_resource(BoundaryResource, '/api/boundaries')
rest_api.add_resource(BoundaryDetailResource, '/api/boundaries/<int:boundaryid>')
rest_api.add_resource(BoundaryDetailCircleResource, '/api/boundaries/<int:boundaryid>/circle')


