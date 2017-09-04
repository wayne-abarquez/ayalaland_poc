from flask import Blueprint

reports = Blueprint('reports', __name__)

from . import controllers
from . import resources
