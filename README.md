# Auth Service

## What is this?

Basically a fast Node.js based JWT service, which also supports Google OAuth and Microsoft OAuth. I use it for a lot of personal projects to solve authentication.

## Setup

1. Run `node bin/generateKeyPair.mjs <environment>` to generate JWT signing keys and update src/public/.well-known -> "jwks.json"
2. Copy secret omitted from command above (keyid & key password) in "secrets/<_environment_>.env" (e.g. secrets/development.env)
3. Generate a strong secret/password somehow (e.g. `crypto.randomUUID().replaceAll('-', '').substring(0, 16)`)
4. Run `node bin/lockSecret.mjs <environment> <secret>` to encrypt secrets, use secret/password from step 3 here (encryption uses Node GPG)

## Environment Variables

Required for basic functionality:
- `AUTH_SERVER_PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/test/production)
- `DB_CONN` - PostgreSQL connection string
- `KEY_SUFFIX` - Key file suffix (_development, _production)
- `KEY_SECRET` - Private key passphrase
- `KEY_ID` - JWT key ID claim

Required for Google OAuth:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URI` - OAuth callback URL

Required for Microsoft OAuth:
- `MICROSOFT_CLIENT_ID` - Azure AD application client ID
- `MICROSOFT_CLIENT_SECRET` - Azure AD application client secret
- `MICROSOFT_TENANT_ID` - Azure AD tenant ID (or 'common' for multi-tenant)
- `MICROSOFT_CALLBACK_URI` - OAuth callback/redirect URI

## Common HTTP requests (using HTTPIE)

- `http POST http://localhost:9090/v1/users email="ryan@example.com" password="123456" confirmedPassword="123456"`
- `http POST http://localhost:9090/v1/sessions email="ryan@example.com" password="123456"`
- `http POST http://localhost:9090/v1/login/google code="<authorization_code>"`
- `http POST http://localhost:9090/v1/login/microsoft code="<authorization_code>"`
- `http GET http://localhost:9090/v1/user authorization:"token <jwt>"`
