import bcrypt from 'bcrypt'

import db from '../repositories/db'
import User from '../repositories/user'
import CreateUserState from '../handlers/users/create/createUserState'

const SALT_ROUNDS = 10

const createUserInDB = async (state: CreateUserState) => {
  state.encryptedPassword = await bcrypt.hash(state.password, SALT_ROUNDS)

  // TODO: DI for DB
  state.userId = await new User(db).createUser(state.email, state.encryptedPassword)

  return state
}

export default createUserInDB
