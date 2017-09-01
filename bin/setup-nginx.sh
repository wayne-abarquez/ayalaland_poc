#!/usr/bin/env bash

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/places_of_interest
sudo rm /etc/nginx/sites-enabled/places_of_interest
sudo cp conf/nginx.conf /etc/nginx/sites-available/places_of_interest
sudo ln -s /etc/nginx/sites-available/places_of_interest /etc/nginx/sites-enabled/places_of_interest
sudo /etc/init.d/nginx reload
