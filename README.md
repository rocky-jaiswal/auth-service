# Auth Service

## Setup

1. Run `node bin/generateKeyPair.mjs <environment>` to generate JWT signing keys and update src/public/.well-known -> "jwks.json"
2. Copy secret omitted from command above (keyid & key password) in "secrets/<environment>.yaml" (e.g. secrets/development.yaml)
3. Generate a strong secret/password somehow (e.g. `crypto.randomUUID().replaceAll('-', '').substr(16)`)
4. Run `node bin/lockSecret.js <environment> <secret>` to encrypt secrets, use secret/password from step 3 here (encryption uses Node GPG)
5. Copy the secret/password to .env
6. Run DB with `docker-compose up --build`
7. Run `./run_dev.sh`
