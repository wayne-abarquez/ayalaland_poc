from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand

from app import app
from app import db
from app.authentication.models import Roles, Users
from app.home.models import BoundaryTable, BoundaryType, Lots, LotDetails, LotLandbank, LotAcquiredLaunches, \
    LotLegalIssues, LotTechnicalIssues
from app.seeds.seeder import BaseSeeder

manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    db.create_all()
    print "Initialized the Database"


@manager.command
def dropdb():
    if prompt_bool("Are you sure you want to Drop your Database?"):
        db.drop_all()
        print "Database Dropped"


@manager.command  
def create_users():
    BaseSeeder.load_users()
    print "Created sample users"

# @manager.option('-f', '--filename', dest='filename')
# @manager.option('-c', '--clean', dest='cleantable', default=False)
# @manager.option('-r', '--recluster', dest='recluster', default=False)
# def load_nrhp_data(filename, cleantable, recluster):
#     from app.services import nrhp_service
#
#     nrhp_service.load_nrhp_data_from_csv(filename, cleantable)
#     if recluster:
#         nrhp_service.recluster()


# @manager.option('-r', '--region', dest='region')
# @manager.option('-f', '--infile', dest='infile')
# def load_population(infile, region):
#     print "Load Population"
#     load_population_from_excel(infile, region)


if __name__ == '__main__':
    manager.run()
