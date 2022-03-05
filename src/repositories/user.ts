import { Knex } from 'knex'

class User {
  public static readonly TABLE_NAME = 'users'

  public readonly db: Knex

  constructor(db: Knex) {
    this.db = db
  }

  public async createUser(email: string, encryptedPassword: string) {
    const userId = (await this.db(User.TABLE_NAME).returning('id').insert({
      email: email,
      encrypted_password: encryptedPassword,
    })) as string

    return userId
  }

  public async findByEmail(email: string) {
    const user = await this.db(User.TABLE_NAME)
      .where({ email })
      .select(['id', 'encrypted_password'])
      .first()

    return user
  }
}

export default User
