#!/bin/bash
echo $(TZ='Europe/Rome' date '+%d/%m/%Y %H:%M') > build_be.html

# Carica le variabili d'ambiente dal file .env
set -a
source /home/survivor/.envTest
set +a

# Avvia l'applicazione Spring Boot
cd /home/survivor/github/survivor_test/survivor_backend

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXXspring.profiles.active=prod"

