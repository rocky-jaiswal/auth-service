#!/bin/sh

node /opt/app/bin/unlockSecret.mjs development $SECRET && \
DOTENV_CONFIG_PATH=/opt/app/secrets/development.env npx knex migrate:latest && \
yarn run:dev
