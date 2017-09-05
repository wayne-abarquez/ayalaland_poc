from app import db
from app.home.models import Lots, LotIssues
from sqlalchemy import func


def get_issues_by_type(type):
    return LotIssues.query.filter(LotIssues.type == type.upper()).order_by(LotIssues.date_reported.desc()).all()


def get_landbank_inventory_gis():
    result = db.session.query(
        Lots.id,
        Lots.lot_offer_no,
        Lots.estate_name,
        Lots.project_name,
        Lots.complete_address,
        Lots.sbu,
        Lots.lot_status,
        func.ST_PointOnSurface(Lots.geom).label('center'),
        Lots.geom
    ).order_by(Lots.id).all()

    items = map(lambda item: {'id': item[0], 'lot_offer_no': item[1], 'estate_name': item[2], 'project_name': item[3],
                              'complete_address': item[4], 'sbu': item[5], 'lot_status': item[6], 'center': item[7],
                              'geom': item[8]}, result)

    return items
