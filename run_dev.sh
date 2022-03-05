#!/bin/sh

export NODE_ENV=development

read_var_from_env() {
    cat .env | grep $1= | cut -d '=' -f2
}

SECRET=$(read_var_from_env SECRET)

yarn clean
cp -R src/keys dist/keys
cp -R src/public dist/public
node bin/unlockSecret.js development $SECRET
yarn migrate-latest
yarn dev
