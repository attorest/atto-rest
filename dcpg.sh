#!/usr/bin/env bash
echo "${@}" | docker-compose exec -T postgres psql --username "postgres" --dbname "chat"
