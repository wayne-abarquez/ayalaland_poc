#!/usr/bin/env bash

#remember to set password for postgres user
#see: http://suite.opengeo.org/4.1/dataadmin/pgGettingStarted/firstconnect.html
#then you can set default password for account by creating ~/.pgpass which contains
#hostname:port:database:username:password
#e.g. localhost:5432:*:postgres:mypassword


echo "CREATE USER demouser WITH PASSWORD 'youcantguess';" | psql -h localhost -U postgres

echo "CREATE DATABASE ayalaland_poc;" | psql -h localhost -U postgres

echo "CREATE EXTENSION postgis;" | psql -h localhost -U postgres -d ayalaland_poc

echo "GRANT ALL PRIVILEGES ON DATABASE ayalaland_poc TO demouser;" | psql -h localhost -U postgres

# execute this if relation error in sqlachemy
# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to demouser;
