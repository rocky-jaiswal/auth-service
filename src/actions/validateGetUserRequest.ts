import { Either } from 'purify-ts'

import BadRequestError from '../errors/badRequestError'
import GetUserState from '../handlers/users/get/getUserState'

const validateGetUserRequest = async (state: GetUserState) => {
  return Either.encase(() => {
    if (!state.authorization) {
      throw new BadRequestError('Invalid request - no authorization header')
    }
    state.token = state.authorization.substring(6)
    return state
  })
}

export default validateGetUserRequest
