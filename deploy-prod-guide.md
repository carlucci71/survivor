# 🚀 Guida Deploy Produzione - Survivor App

## 📋 Situazione Attuale (TEST)
- Backend Java con Spring Boot su porta custom
- Frontend Angular servito con `ng serve` su porta 4200
- IP pubblico: 85.235.148.177
- Credenziali hardcoded nello script di avvio

---

## ✅ Passi per Produzione

### 1. Preparazione Ambiente

#### 1.1 Installare strumenti necessari
```bash
# Installa nginx
sudo apt update
sudo apt install nginx

# Installa PM2 (process manager per Node.js)
sudo npm install -g pm2

# Installa certbot per HTTPS
sudo apt install certbot python3-certbot-nginx
```

#### 1.2 Configurare dominio
- Registra un dominio (es. `survivor-app.com`)
- Punta il DNS all'IP `85.235.148.177`
- Aspetta propagazione DNS (può richiedere 24-48h)

---

### 2. Gestione Credenziali Sicura

#### 2.1 Creare file `.env`
```bash
cd ~
nano .env
```

Contenuto del file `.env`:
```bash
ENV_DB_PASSWORD=ddls0lDB1
ENV_ADMIN_PASSWORD=PWD_@Dm1n
ENV_JWT_SECRET=0349dffb83027c2e2ba5b1cdf14bd63c5bdf9f809466c056999cfb754bf4092b
ENV_MAIL_PASSWORD=kdzsbtbivpxwbakl
ENV_SERVER=https://survivor-app.com  # Cambia con il tuo dominio
```

#### 2.2 Proteggere il file
```bash
chmod 600 ~/.env
# Aggiungi .env al .gitignore se usi git
echo ".env" >> .gitignore
```

---

### 3. Build Frontend

#### 3.1 Build di produzione Angular
```bash
cd survivor_webapp
ng build --configuration production
```

Questo crea la cartella `dist/survivor-webapp` con i file statici ottimizzati.

---

### 4. Configurare Nginx

#### 4.1 Creare configurazione Nginx
```bash
sudo nano /etc/nginx/sites-available/survivor
```

Contenuto della configurazione:
```nginx
server {
    listen 80;
    server_name survivor-app.com www.survivor-app.com;  # Usa il tuo dominio

    # Frontend Angular
    location / {
        root /home/survivor/survivor_webapp/dist/survivor-webapp;
        try_files $uri $uri/ /index.html;
        
        # Cache per file statici
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/;  # Porta del backend Spring Boot
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4.2 Attivare la configurazione
```bash
# Crea link simbolico
sudo ln -s /etc/nginx/sites-available/survivor /etc/nginx/sites-enabled/

# Testa la configurazione
sudo nginx -t

# Riavvia nginx
sudo systemctl restart nginx
```

---

### 5. Configurare HTTPS con Let's Encrypt

```bash
# Ottieni certificato SSL (richiede dominio configurato)
sudo certbot --nginx -d survivor-app.com -d www.survivor-app.com

# Certbot aggiorna automaticamente la configurazione nginx per HTTPS
# Rinnovo automatico è già configurato

#0 3 * * * /usr/bin/certbot renew --quiet

```

---

### 6. Gestione Processi con PM2

#### 6.1 Creare script per backend
```bash
nano ~/start-backend.sh
```

Contenuto:
```bash
#!/bin/bash
source ~/.env
cd ~/survivor_backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=prod"
```

```bash
chmod +x ~/start-backend.sh
```

#### 6.2 Configurare PM2
```bash
# Avvia backend con PM2
pm2 start ~/start-backend.sh --name survivor-backend

# Salva configurazione PM2
pm2 save

# Avvio automatico al boot
pm2 startup
# Esegui il comando che PM2 ti suggerisce (con sudo)
```

---

### 7. Script di Deploy Aggiornato

Crea `deploy.sh`:
```bash
#!/bin/bash

echo "🔄 Deploy Survivor App"

# Carica variabili ambiente
source ~/.env

# Kill processi vecchi (se esistono)
pm2 stop survivor-backend 2>/dev/null || true

echo "📦 Build frontend..."
cd ~/survivor_webapp
npm install
ng build --configuration production

echo "🔄 Restart backend..."
pm2 restart survivor-backend || pm2 start ~/start-backend.sh --name survivor-backend

echo "🔄 Reload nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deploy completato!"
echo "📊 Status:"
pm2 status
```

```bash
chmod +x ~/deploy.sh
```

---

### 8. Monitoring e Manutenzione

#### 8.1 Comandi utili PM2
```bash
# Vedere status
pm2 status

# Vedere log
pm2 logs survivor-backend

# Restart
pm2 restart survivor-backend

# Stop
pm2 stop survivor-backend
```

#### 8.2 Log Nginx
```bash
# Errori nginx
sudo tail -f /var/log/nginx/error.log

# Accessi nginx
sudo tail -f /var/log/nginx/access.log
```

#### 8.3 Rotazione log
PM2 gestisce già la rotazione dei log. Per nginx:
```bash
sudo logrotate -f /etc/logrotate.d/nginx
```

---

### 9. Backup

#### 9.1 Script backup database
```bash
nano ~/backup-db.sh
```

```bash
#!/bin/bash
source ~/.env
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup MySQL/PostgreSQL (adatta al tuo DB)
# mysqldump -u user -p$ENV_DB_PASSWORD dbname > $BACKUP_DIR/db_$DATE.sql

# Mantieni solo ultimi 7 backup
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "✅ Backup completato: db_$DATE.sql"
```

#### 9.2 Cron per backup automatico
```bash
crontab -e
# Aggiungi: backup giornaliero alle 2 AM
0 2 * * * ~/backup-db.sh
```

---

### 10. Sicurezza Aggiuntiva

#### 10.1 Firewall
```bash
# Permetti solo porte necessarie
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

#### 10.2 Fail2ban (protezione da attacchi brute force)
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 🎯 Checklist Pre-Produzione

- [ ] Dominio configurato e DNS propagato
- [ ] File `.env` creato e protetto
- [ ] Frontend buildato con `ng build --configuration production`
- [ ] Nginx installato e configurato
- [ ] HTTPS configurato con Let's Encrypt
- [ ] PM2 configurato per backend
- [ ] Script di deploy testato
- [ ] Backup database configurato
- [ ] Firewall attivo
- [ ] Monitoring configurato (PM2 + log nginx)
- [ ] Testato tutto in ambiente di staging prima

---

## 🆘 Troubleshooting

### Frontend non si carica
```bash
# Verifica build
ls -la ~/survivor_webapp/dist/survivor-webapp

# Verifica permessi
sudo chown -R www-data:www-data ~/survivor_webapp/dist

# Verifica nginx
sudo nginx -t
sudo systemctl status nginx
```

### Backend non risponde
```bash
# Verifica PM2
pm2 logs survivor-backend

# Verifica porta in ascolto
netstat -tulpn | grep 8080
```

### HTTPS non funziona
```bash
# Verifica certificato
sudo certbot certificates

# Rinnova manualmente
sudo certbot renew --dry-run
```

---

## 📚 Risorse Utili

- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Angular Deployment](https://angular.io/guide/deployment)
- [Spring Boot Production Best Practices](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)

---

**Note:** Adatta i percorsi, nomi di dominio e porte secondo la tua configurazione specifica.