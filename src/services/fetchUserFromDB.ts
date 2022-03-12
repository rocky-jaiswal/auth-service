import BadRequestError from '../errors/badRequestError'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'

// TODO: DB as DI

export const fetchUserById = (raiseErrorIfNotFound: boolean) => async (id: string) => {
  const user = await new UserRepository(db).findById(id)
  return raiseErrorIfNotFound ? user.toEither(new BadRequestError('user not found')) : user
}

export const fetchUserByEmail = async (email: string) => {
  const user = await new UserRepository(db).findByEmail(email)
  return user
}
