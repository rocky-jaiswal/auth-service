#!/bin/sh

export NODE_ENV=development

yarn clean
cp -R src/keys dist/keys
cp -R src/public dist/public

node bin/unlockSecret.mjs development $1
rm -rf .env
cp secrets/development.env ./.env

yarn migrate-latest
yarn dev
