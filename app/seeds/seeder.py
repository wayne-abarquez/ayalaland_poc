from app import db
from app.authentication.models import Roles, Users
from app.seeds.datasource import roles, users
from datetime import datetime
import time
from itertools import groupby
from faker import Factory
from datetime import datetime

fake = Factory.create('en_US')


class BaseSeeder:
    now = datetime.now()

    @staticmethod
    def refresh_table(table_name):
        db.session.execute('TRUNCATE "' + table_name + '" RESTART IDENTITY CASCADE')
        db.session.commit()

    @staticmethod
    def load_roles():
        # truncate table
        BaseSeeder.refresh_table('roles')

        for data in roles.roles:
            role = Roles.from_dict(data)
            db.session.add(role)

        db.session.commit()

    @staticmethod
    def load_users():
        # Load Roles First
        BaseSeeder.load_roles()

        # truncate table
        BaseSeeder.refresh_table('users')

        for data in users.users:
            user = Users.from_dict(data)
            user.password = data['password'] if 'password' in data else users.test_password
            db.session.add(user)

        db.session.commit()
