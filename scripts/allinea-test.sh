#!/bin/bash
echo allinea test
cd /home/survivor/github/survivor_test
git reset --hard
git pull
./deploy-test.sh
