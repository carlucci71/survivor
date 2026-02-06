#!/bin/bash
cp ../../survivor_test/survivor_backend/build_be.html .
# Carica le variabili d'ambiente dal file .env
set -a
source /home/survivor/.env
set +a

# Avvia l'applicazione Spring Boot
cd /home/survivor/github/survivor/survivor_backend

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXXspring.profiles.active=prod"

