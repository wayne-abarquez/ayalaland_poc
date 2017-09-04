from app import app
from . import reports
from flask import render_template
from flask_login import login_required
import logging

log = logging.getLogger(__name__)

GOOGLE_MAP_API_KEY = app.config['GOOGLE_MAP_API_KEY']


@reports.route('/reports', methods=['GET'])
@login_required
def index():
    return render_template('/reports.html', gmap_api_key=GOOGLE_MAP_API_KEY)
