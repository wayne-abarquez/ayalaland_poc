from flask.ext.restful import Resource, marshal_with, marshal, abort
from .fields import boundary_fields, boundary_complete_fields, lot_fields, lot_complete_fields, lot_offer_create_fields
from app import rest_api
# from app.fields import success_with_result_fields
from app.home.services import get_boundaries, get_boundaries_by_type, get_boundary_detail, get_places_by_boundary, get_lots, \
    get_lot_details, upload_shape_file, \
    create_lot_offer, filter_lots
from app.resources import UploadResource
from flask import request
import logging

log = logging.getLogger(__name__)


class BoundaryResource(Resource):
    """
    Resource for getting all Boundary
    """

    @marshal_with(boundary_fields)
    def get(self):
        """ GET /boundaries """

        if 'parent_id' in request.args:
            return get_boundaries(request.args['parent_id'])
        elif 'type_id' in request.args:
            return get_boundaries_by_type(request.args['type_id'])

        return get_boundaries()


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


class LotResource(Resource):
    """
    Resource for getting Lots
    """

    @marshal_with(lot_fields)
    def get(self):
        """ GET /lots """
        print "get lots: {0}".format(request.args)

        if bool(request.args):
            return filter_lots(request.args)

        return get_lots()

    def post(self):
        form_data = request.json
        log.debug('Create Lot Offer request: {0}'.format(form_data))
        # form = AddBranchForm.from_json(form_data)
        # if form.validate():
        obj = create_lot_offer(form_data)
        result = dict(status=200, message='OK', lot=obj)
        return marshal(result, lot_offer_create_fields)
        # else:
        #     abort(400, message="Invalid Parameters", errors=form.errors)


class LotDetailsResource(Resource):
    """
    Resource for getting Lot Details
    """

    @marshal_with(lot_complete_fields)
    def get(self, lotid):
        """ GET /lots/<lotid> """
        return get_lot_details(lotid)


class LotUploadResource(UploadResource):
    """
    Resource for Lot data uploads
    """

    def post(self):
        data = request.form

        log.debug("POST Upload Shape File request : {0}".format(data))

        uploaded_file = request.files['file']

        # print uploaded_file.__dict__

        upload_shape_file(uploaded_file)

        # if uploaded_file and self.allowed_excel_file(uploaded_file.filename):
        #     result = upload_fraud_data(uploaded_file)
        #     return marshal(dict(status=200, message="OK", result=result), success_with_result_fields)
        # else:
        #     abort(400, message="Invalid parameters")

rest_api.add_resource(BoundaryResource, '/api/boundaries')
rest_api.add_resource(BoundaryDetailResource, '/api/boundaries/<int:boundaryid>')
rest_api.add_resource(BoundaryDetailCircleResource, '/api/boundaries/<int:boundaryid>/circle')
rest_api.add_resource(LotResource, '/api/lots')
rest_api.add_resource(LotDetailsResource, '/api/lots/<int:lotid>')
rest_api.add_resource(LotUploadResource, '/api/lots/upload')


