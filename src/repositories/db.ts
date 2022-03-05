import { Knex } from 'knex'
import Pg from 'pg'

const environment = process.env.NODE_ENV || 'development'
const config = require('../../knexfile.js')[environment]

Pg.types.setTypeParser(20, 'text', parseInt)
Pg.types.setTypeParser(1700, 'text', parseFloat)

const DB: Knex = require('knex')(config)

export default DB
