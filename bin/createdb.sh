#!/usr/bin/env bash

#remember to set password for postgres user
#see: http://suite.opengeo.org/4.1/dataadmin/pgGettingStarted/firstconnect.html
#then you can set default password for account by creating ~/.pgpass which contains
#hostname:port:database:username:password
#e.g. localhost:5432:*:postgres:mypassword


echo "CREATE USER demouser WITH PASSWORD 'youcantguess';" | psql -h localhost -U postgres

echo "CREATE DATABASE places_of_interest;" | psql -h localhost -U postgres

echo "CREATE EXTENSION postgis;" | psql -h localhost -U postgres -d places_of_interest

echo "GRANT ALL PRIVILEGES ON DATABASE places_of_interest TO demouser;" | psql -h localhost -U postgres

# execute this if relation error in sqlachemy
# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to demouser;

# fix issues on migrations
# ALTER TABLE mv_bbtech_dp OWNER TO demouser;