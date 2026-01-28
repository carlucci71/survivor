Avvio dell'app nel profilo 'server' con FCM (Windows cmd.exe)

Nota: per ambiente server/production è fortemente consigliato usare un secret manager; qui mostriamo come impostare variabili d'ambiente sul sistema.

Prerequisiti:
- File service account JSON scaricato da Firebase Console (Service accounts > Generate new private key)
- Caricato e accessibile sul server, es.: C:\segreti\firebase\serviceAccountKey.json
- Privilegi per impostare variabili d'ambiente e leggere il file

Esempio comandi (cmd.exe) — run temporaneo nella sessione:

cd /d C:\1\survivor\survivor_backend
change-java 21
set PUSH_FCM_ENABLED=true
set PUSH_FCM_CREDENTIALS_PATH=C:\segreti\firebase\serviceAccountKey.json
rem oppure se usi JSON inline (non consigliato): set PUSH_FCM_CREDENTIALS_JSON={...}

mvn -DskipTests=false -Dspring-boot.run.profiles=server spring-boot:run

Esempio build + jar:

cd /d C:\1\survivor\survivor_backend
change-java 21
set PUSH_FCM_ENABLED=true
set PUSH_FCM_CREDENTIALS_PATH=C:\segreti\firebase\serviceAccountKey.json
mvn -DskipTests=false clean package
java -jar target\survivor-0.0.1-SNAPSHOT.jar --spring.profiles.active=server

Note di sicurezza:
- Non committare il file di service account nel repo.
- In produzione usa secret manager o variabili d'ambiente persistenti, non il comando 'set' nella sessione.
- Se esegui in container, monta il file come volume e imposta le env var nel container runtime.
