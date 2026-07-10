#!/bin/bash
echo $(TZ='Europe/Rome' date '+%d/%m/%Y %H:%M') > survivor_webapp/src/assets/build_fe.html
grep -oP 'versionCode \K\d+' survivor_webapp/android/app/build.gradle > survivor_backend/min_version_code.txt

echo "🔄 Deploy Test Survivor App"

# Carica variabili ambiente
source ~/.envTest

# Kill processi vecchi (se esistono)
pm2 stop survivor-backend-test 2>/dev/null || true

echo "📦 Build frontend..."
cd /home/survivor/github/survivor_test/survivor_webapp
npm install
ng build --configuration test

echo "🔄 Restart backend..."
#pm2 restart survivor-backend || pm2 start ~/start-backend.sh --name survivor-backend
pm2 restart survivor-backend-test

#echo "🔄 Reload nginx..."
#sudo nginx -t && sudo systemctl reload nginx
sudo /usr/sbin/nginx -s reload



echo "✅ Deploy completato!"
echo "📊 Status:"
pm2 status

