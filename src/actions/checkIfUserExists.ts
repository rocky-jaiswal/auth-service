import { Either, Left, Right } from 'purify-ts'

import { fetchUserByEmail } from '../services/fetchUserFromDB'
import BadRequestError from '../errors/badRequestError'
import ServerError from '../errors/serverError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'

const checkIfUserExists = async (
  state: CreateSessionState
): Promise<Either<Error, CreateSessionState>> => {
  try {
    const user = await fetchUserByEmail(state.email)

    if (user.isNothing()) {
      return Left(new BadRequestError('user does not exist'))
    }

    state.user = user.extract()
    return Right(state)
  } catch (err) {
    // TODO: Log this error
    return Left(new ServerError('server error'))
  }
}

export default checkIfUserExists
