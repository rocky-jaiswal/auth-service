import bcrypt from 'bcrypt'

import db from '../repositories/db'
import User from '../repositories/user'

interface HasUserCredentials {
  email: string
  password: string
  userId?: string
}

const SALT_ROUNDS = 10

const createUserInDB = async (params: HasUserCredentials) => {
  const encryptedPassword = await bcrypt.hash(params.password, SALT_ROUNDS)

  // TODO: DI for DB
  params.userId = await new User(db).createUser(params.email, encryptedPassword)

  return params
}

export default createUserInDB
