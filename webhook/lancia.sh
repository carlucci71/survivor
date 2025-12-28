#!/bin/bash
source /home/survivor/.env
envsubst < hooks.json.template > hooks.json
webhook -verbose -hooks hooks.json -port 9000
 