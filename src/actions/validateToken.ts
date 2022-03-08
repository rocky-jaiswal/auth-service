import { Either } from 'purify-ts'

import GetUserState from '../handlers/users/get/getUserState'
import verifyJWT from '../services/verifyJWT'
import BadRequestError from '../errors/badRequestError'

const validateToken = async (state: GetUserState) =>
  Either.encase(() => {
    try {
      const decoded = verifyJWT(state.token!) as any
      state.userId = decoded.id
      return state
    } catch (err) {
      state.logger.error(err)
      throw new BadRequestError('invalid request - bad token')
    }
  })

export default validateToken
