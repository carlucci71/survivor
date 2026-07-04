#!/bin/bash
cp ../survivor_test/survivor_webapp/src/assets/build_fe.html survivor_webapp/src/assets/
echo "🔄 Deploy Survivor App"

# Carica variabili ambiente
source ~/.env

# Kill processi vecchi (se esistono)
pm2 stop survivor-backend 2>/dev/null || true

echo "📦 Build frontend..."
cd /home/survivor/github/survivor/survivor_webapp
npm install
ng build --configuration production

echo "🔄 Restart backend..."
#pm2 restart survivor-backend || pm2 start ~/start-backend.sh --name survivor-backend
pm2 restart survivor-backend

echo "🔄 Aggiorno config nginx..."
sudo cp /home/survivor/github/survivor/ngnix/liberaleidee.it /etc/nginx/sites-available/liberaleidee.it
sudo /usr/sbin/nginx -t && sudo /usr/sbin/nginx -s reload



echo "✅ Deploy completato!"
echo "📊 Status:"
pm2 status

