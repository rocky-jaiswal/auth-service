import { Either, Left, Right } from 'purify-ts'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'

import ServerError from '../errors/serverError'
import CreateMicrosoftUserState from '../handlers/oauth/microsoft/createMicrosoftUserState'

const fetchOrCreateMicrosoftUser = async (
  state: CreateMicrosoftUserState
): Promise<Either<Error, CreateMicrosoftUserState>> => {
  try {
    const userRepo = new UserRepository(db)
    const maybeUser = await userRepo.findByEmail(state.email!)

    const user = await maybeUser.caseOf({
      Just: (user) => Promise.resolve(user),
      Nothing: () => userRepo.createMicrosoftUser(state.email!),
    })

    state.user = user

    return Right(state)
  } catch (err) {
    // TODO: Log this error
    return Left(new ServerError('server error'))
  }
}

export default fetchOrCreateMicrosoftUser
