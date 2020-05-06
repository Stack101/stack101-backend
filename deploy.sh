#!/bin/bash

pm2 stop server

cd /home/ec2-user/app/stack101-backend/zip

npm install

npm start