#!/bin/sh

DOTENV_CONFIG_PATH=/opt/app/secrets/development.env npx knex migrate:latest && yarn run:dev
