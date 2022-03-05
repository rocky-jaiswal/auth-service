import GetUserState from '../handlers/users/get/getUserState'
import verifyJWT from '../services/verifyJWT'
import BadRequestError from '../errors/badRequestError'

const validateToken = async (state: GetUserState) => {
  try {
    const decoded = verifyJWT(state.token!) as any
    state.userId = decoded.id[0]
  } catch (err) {
    state.logger.error(err)
    throw new BadRequestError('Invalid request - bad token')
  }
  return state
}

export default validateToken
