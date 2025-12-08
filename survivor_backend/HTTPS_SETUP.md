# Configurazione HTTPS

## Panoramica
L'applicazione è stata configurata per supportare HTTPS utilizzando un certificato SSL autofirmato per lo sviluppo e il test.

## Certificato SSL
- **File**: `src/main/resources/survivor-keystore.p12`
- **Tipo**: PKCS12
- **Alias**: survivor
- **Password**: changeit
- **Validità**: 10 anni

## Configurazione

### application.yaml
Il server è configurato per supportare SSL con i seguenti parametri:
```yaml
server:
  ssl:
    enabled: ${SSL_ENABLED:false}
    key-store: ${SSL_KEYSTORE:classpath:survivor-keystore.p12}
    key-store-password: ${SSL_KEYSTORE_PASSWORD:changeit}
    key-store-type: PKCS12
    key-alias: survivor
```

### application-test.yaml e application-dev.yaml
HTTPS è abilitato di default in questi profili:
```yaml
SSL_ENABLED: true
SSL_KEYSTORE: classpath:survivor-keystore.p12
SSL_KEYSTORE_PASSWORD: changeit
MAGIC_LINK_BASE_URL: ${ENV_SERVER:https://localhost}:4200
```

## Accesso all'applicazione
- **URL**: https://localhost:8389
- **Swagger UI**: https://localhost:8389/swagger-ui.html
- **API Docs**: https://localhost:8389/v3/api-docs

## Avviso certificato nel browser
Poiché il certificato è autofirmato, il browser mostrerà un avviso di sicurezza. Per lo sviluppo locale, puoi procedere ignorando l'avviso.

### Chrome/Edge
1. Clicca su "Avanzate"
2. Clicca su "Procedi a localhost (non sicuro)"

### Firefox
1. Clicca su "Avanzate"
2. Clicca su "Accetta il rischio e continua"

## Rigenerazione del certificato (se necessario)
```bash
cd src/main/resources
keytool -genkeypair -alias survivor -keyalg RSA -keysize 2048 -storetype PKCS12 \
  -keystore survivor-keystore.p12 -validity 3650 \
  -storepass changeit -keypass changeit \
  -dname "CN=localhost, OU=Development, O=DDL Solution, L=Rome, ST=Lazio, C=IT"
```

## Produzione
Per l'ambiente di produzione, è necessario utilizzare un certificato SSL valido rilasciato da una Certificate Authority (CA) come Let's Encrypt, DigiCert, ecc.

## Disabilitare HTTPS (per test locali)
Per disabilitare HTTPS temporaneamente, imposta la variabile d'ambiente:
```
SSL_ENABLED=false
```
E aggiorna MAGIC_LINK_BASE_URL con `http://` invece di `https://`.

