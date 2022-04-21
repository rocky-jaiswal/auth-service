import type { Knex } from 'knex'
import { Just, Nothing } from 'purify-ts'

import User from '../models/user'

class UserRepository {
  public static readonly TABLE_NAME = 'users'

  public readonly db: Knex

  constructor(db: Knex) {
    this.db = db
  }

  public async createDBUser(email: string, encryptedPassword: string) {
    const user = (await this.db(UserRepository.TABLE_NAME)
      .returning(['id', 'email', 'encrypted_password'])
      .insert({
        email: email,
        encrypted_password: encryptedPassword,
        auth_type: 'db',
      })) as any[]

    return User.create(user[0].id, user[0].email, user[0].encrypted_password)
  }

  public async createGoogleUser(email: string) {
    const user = (await this.db(UserRepository.TABLE_NAME).returning(['id', 'email']).insert({
      email: email,
      auth_type: 'google',
    })) as any[]

    return User.create(user[0].id, user[0].email, '')
  }

  public async findByEmail(email: string) {
    const user = await this.db(UserRepository.TABLE_NAME)
      .where({ email })
      .select(['id', 'email', 'encrypted_password'])
      .first()

    return user ? Just(User.create(user.id, user.email, user.encrypted_password)) : Nothing
  }

  public async findById(id: string) {
    const user = await this.db(UserRepository.TABLE_NAME)
      .where({ id })
      .select(['id', 'email', 'encrypted_password'])
      .first()

    return user ? Just(User.create(user.id, user.email, user.encrypted_password)) : Nothing
  }
}

export default UserRepository
