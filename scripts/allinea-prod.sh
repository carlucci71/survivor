#!/bin/bash
echo allinea prod
cd /home/survivor/github/survivor
git reset --hard
git pull
./deploy.sh

