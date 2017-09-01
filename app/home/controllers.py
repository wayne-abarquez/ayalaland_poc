from . import home
from flask import render_template
import logging

log = logging.getLogger(__name__)

@home.route('/', methods=['GET', 'POST'])
@home.route('/index', methods=['GET', 'POST'])
def index():
    return render_template('/index.html')
