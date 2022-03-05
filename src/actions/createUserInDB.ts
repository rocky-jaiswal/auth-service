import bcrypt from 'bcrypt'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'
import CreateUserState from '../handlers/users/create/createUserState'

const SALT_ROUNDS = 10

const createUserInDB = async (state: CreateUserState) => {
  state.encryptedPassword = await bcrypt.hash(state.password, SALT_ROUNDS)

  // TODO: DI for DB
  state.userId = await new UserRepository(db).createUser(state.email, state.encryptedPassword)

  return state
}

export default createUserInDB
