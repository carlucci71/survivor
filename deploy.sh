#!/bin/bash

echo "🔄 Deploy Survivor App"

# Carica variabili ambiente
source ~/.env

# Kill processi vecchi (se esistono)
pm2 stop survivor-backend 2>/dev/null || true

echo "📦 Build frontend..."
cd /home/survivor/github/survivor/survivor_webapp
npm install
ng build --configuration test

echo "🔄 Restart backend..."
#pm2 restart survivor-backend || pm2 start ~/start-backend.sh --name survivor-backend
pm2 restart survivor-backend

#echo "🔄 Reload nginx..."
#sudo nginx -t && sudo systemctl reload nginx
sudo /usr/sbin/nginx -s reload



echo "✅ Deploy completato!"
echo "📊 Status:"
pm2 status

