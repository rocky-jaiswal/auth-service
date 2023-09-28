set dotenv-load

NODE_ENV := "development"
DOTENV_CONFIG_PATH := "./secrets/development.env"

create-migration:
	NODE_ENV=development npx knex migrate:make

migrate-latest:
	npx knex migrate:latest

clean:
	rm -rf dist/
	mkdir dist

build: clean
	yarn tsc
	cp -R src/keys dist/keys
	cp -R src/public dist/public

lint:
	yarn eslint 'src/**/*'

test:
	NODE_ENV=test DOTENV_CONFIG_PATH="./secrets/test.env" npx knex migrate:latest
	NODE_ENV=test DOTENV_CONFIG_PATH="./secrets/test.env" yarn jest --runInBand

dev: clean build
	node bin/unlockSecret.mjs {{NODE_ENV}} $AUTH_SERVICE_SECRET
	DOTENV_CONFIG_PATH={{DOTENV_CONFIG_PATH}} npx knex migrate:latest
	DOTENV_CONFIG_PATH={{DOTENV_CONFIG_PATH}} npx nodemon src/index.ts
