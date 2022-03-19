.dev: NODE_ENV = development

.create-migration:
	NODE_ENV=development npx knex migrate:make

.migrate-latest:
	npx knex migrate:latest

.clean:
	rm -rf dist/
	mkdir dist

.build: .clean
	yarn tsc

.lint:
	yarn eslint 'src/**/*'

.test:
	cp secrets/test.env.sample ./.env
	NODE_ENV=test yarn migrate-latest
	NODE_ENV=test yarn jest --runInBand
	rm .env

.watch-node:
	NODE_ENV=development nodemon dist/index.js

.watch-ts:
	NODE_ENV=development npx tsc -w

.dev: .clean .build .migrate-latest
	cp -R src/keys dist/keys
	cp -R src/public dist/public
	rm -rf .env
	node bin/unlockSecret.mjs $(NODE_ENV) $(secret)
	cp secrets/development.env ./.env
	npx concurrently -k -p "[{name}]" -n "TypeScript, Node" -c "yellow.bold, green.bold" "npx tsc -w" "npx nodemon dist/index.js"
