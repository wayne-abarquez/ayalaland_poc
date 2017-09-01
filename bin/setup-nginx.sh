#!/usr/bin/env bash

sudo rm /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-available/ayalaland_poc
sudo rm /etc/nginx/sites-enabled/ayalaland_poc
sudo cp conf/nginx.conf /etc/nginx/sites-available/ayalaland_poc
sudo ln -s /etc/nginx/sites-available/ayalaland_poc /etc/nginx/sites-enabled/ayalaland_poc
sudo /etc/init.d/nginx reload
