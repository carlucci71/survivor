#!/bin/bash
echo "🔄 Deploy Test Survivor App"

# Carica variabili ambiente
source ~/.envTest

# Kill processi vecchi (se esistono)
pm2 stop survivor-backend-test 2>/dev/null || true

echo "📦 Build frontend..."
cd /home/survivor/github/survivor_test/survivor_webapp
npm install
npm run build:test

echo "🔄 Restart backend..."
#pm2 restart survivor-backend || pm2 start ~/start-backend.sh --name survivor-backend
pm2 restart survivor-backend-test

#echo "🔄 Reload nginx..."
#sudo nginx -t && sudo systemctl reload nginx
sudo /usr/sbin/nginx -s reload



echo "✅ Deploy completato!"
echo "📊 Status:"
pm2 status

