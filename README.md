# Auth Service

## Setup

1. Run `node bin/generateKeyPair.mjs <environment>` to generate JWT signing keys and update src/public/.well-known -> "jwks.json"
2. Copy secret omitted from command above (keyid & key password) in "secrets/_environment_.env" (e.g. secrets/development.env)
3. Generate a strong secret/password somehow (e.g. `crypto.randomUUID().replaceAll('-', '').substring(0, 16)`)
4. Run `node bin/lockSecret.js <environment> <secret>` to encrypt secrets, use secret/password from step 3 here (encryption uses Node GPG)
5. Run DB with `docker-compose up --build`
6. Run `./run_dev.sh <secret>`
7. For testing make sure DB is up (via docker-compose) and run `yarn test`
