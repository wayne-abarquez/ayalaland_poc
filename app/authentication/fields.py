from flask.ext.restful import fields

user_fields = dict(
    id=fields.Integer,
    roleid=fields.Integer,
    username=fields.String,
    role=fields.String,
    firstname=fields.String,
    lastname=fields.String
)
