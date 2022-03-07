import { Either, Left, Right } from 'purify-ts'
import bcrypt from 'bcrypt'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'
import CreateUserState from '../handlers/users/create/createUserState'
import ServerError from '../errors/serverError'

const SALT_ROUNDS = 10

const createUserInDB = async (state: CreateUserState): Promise<Either<Error, CreateUserState>> => {
  try {
    const encryptedPassword = await bcrypt.hash(state.password, SALT_ROUNDS)
    state.user = await new UserRepository(db).createUser(state.email, encryptedPassword)

    return Right(state)
  } catch {
    return Left(new ServerError('Server error'))
  }
}

export default createUserInDB
