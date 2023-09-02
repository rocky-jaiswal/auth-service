import type { Knex } from 'knex'

export const getTimeStamp = async (db: Knex) => {
  const date = await db.raw('select current_timestamp')
  return date.rows[0].current_timestamp
}
