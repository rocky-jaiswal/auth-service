'use strict'

require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH })

const dbConfiguration = {
  client: 'postgresql',
  useNullAsDefault: true,
  connection: process.env.DB_CONN,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
}

module.exports = {
  development: dbConfiguration,
  test: dbConfiguration,
  canary: dbConfiguration,
  production: dbConfiguration,
}
