import { Either } from 'purify-ts'

import BadRequestError from '../errors/badRequestError'
import GetUserState from '../handlers/users/get/getUserState'

const validateGetUserRequest = async (state: GetUserState) =>
  Either.encase(() => {
    if (!state.authorization || state.authorization === '' || state.authorization.length < 7) {
      throw new BadRequestError('invalid request - bad authorization header')
    }
    state.token = state.authorization.substring(6)
    return state
  })

export default validateGetUserRequest
