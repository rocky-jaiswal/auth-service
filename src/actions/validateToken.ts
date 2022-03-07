import { Either } from 'purify-ts'

import GetUserState from '../handlers/users/get/getUserState'
import verifyJWT from '../services/verifyJWT'
import BadRequestError from '../errors/badRequestError'

const validateToken = async (state: GetUserState) => {
  return Either.encase(() => {
    try {
      const decoded = verifyJWT(state.token!) as any
      state.userId = decoded.id
      return state
    } catch (err) {
      state.logger.error(err)
      throw new BadRequestError('Invalid request - bad token')
    }
  })
}

export default validateToken
