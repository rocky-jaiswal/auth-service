'use strict'

exports.up = async (knex) => {
  // await knex.raw("CREATE TYPE auth_type AS ENUM ('db', 'google', 'apple');")

  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.text('email').unique().notNull()
    table.boolean('email_verified').defaultTo(false)
    table.text('encrypted_password')
    table.text('auth_type').notNull()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async (knex) => {
  return knex.schema.dropTable('users')
}
