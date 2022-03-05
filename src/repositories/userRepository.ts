import { Knex } from 'knex'

import User from '../models/user'

class UserRepository {
  public static readonly TABLE_NAME = 'users'

  public readonly db: Knex

  constructor(db: Knex) {
    this.db = db
  }

  public async createUser(email: string, encryptedPassword: string) {
    const userId = (await this.db(UserRepository.TABLE_NAME).returning('id').insert({
      email: email,
      encrypted_password: encryptedPassword,
    })) as string

    return userId
  }

  public async findByEmail(email: string) {
    const user = await this.db(UserRepository.TABLE_NAME)
      .where({ email })
      .select(['id', 'encrypted_password'])
      .first()

    return user ? User.create(user.id, user.email, user.encrypted_password) : null
  }

  public async findById(id: string) {
    const user = await this.db(UserRepository.TABLE_NAME)
      .where({ id })
      .select(['id', 'email'])
      .first()

    return user ? User.create(user.id, user.email, user.encrypted_password) : null
  }
}

export default UserRepository
