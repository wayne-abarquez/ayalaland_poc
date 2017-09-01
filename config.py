import os

base_dir = os.path.abspath(os.path.dirname(__file__))

project_name = 'places_of_interest'
db_name = 'places_of_interest'
db_user = 'demouser'


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = project_name
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = project_name
    LOG_FILENAME = '/var/www/' + project_name + '/logs/app.log'
    STATIC_FOLDER = '/var/www/' + project_name + '/client/static'
    TEMPLATES_FOLDER = '/var/www/' + project_name + '/client/templates'
    TMP_DIR = '/var/www/' + project_name + '/tmp'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + db_user + ':youcantguess@localhost:5432/' + db_name


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    pass


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)