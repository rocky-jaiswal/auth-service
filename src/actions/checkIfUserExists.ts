import { Either, Left, Maybe } from 'purify-ts'

import { fetchUserByEmail } from '../services/fetchUserFromDB'
import BadRequestError from '../errors/badRequestError'
import ServerError from '../errors/serverError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'
import User from '../models/user'

const checkIfUserExists = async (state: CreateSessionState) => {
  let user: Maybe<User>
  try {
    user = await fetchUserByEmail(state.email)
  } catch (err) {
    // TODO: Log this error
    return Left(new ServerError('Server error'))
  }

  return Either.encase(() => {
    if (!user || user.isNothing()) {
      throw new BadRequestError('user does not exist')
    }
    state.user = user.extract()
    return state
  })
}

export default checkIfUserExists
