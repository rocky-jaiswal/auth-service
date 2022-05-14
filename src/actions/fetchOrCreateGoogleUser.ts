import { Either, Left, Right } from 'purify-ts'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'

import ServerError from '../errors/serverError'
import CreateGoogleUserState from '../handlers/oauth/google/createGoogleUserState'

const fetchOrCreateGoogleUser = async (
  state: CreateGoogleUserState
): Promise<Either<Error, CreateGoogleUserState>> => {
  try {
    const userRepo = new UserRepository(db)
    const maybeUser = await userRepo.findByEmail(state.email!)

    const user = await maybeUser.caseOf({
      Just: (user) => Promise.resolve(user),
      Nothing: () => userRepo.createGoogleUser(state.email!),
    })

    state.user = user

    return Right(state)
  } catch (err) {
    // TODO: Log this error
    return Left(new ServerError('server error'))
  }
}

export default fetchOrCreateGoogleUser
