import { Either } from 'purify-ts'
import BadRequestError from '../errors/badRequestError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'

const validateSessionCreateRequest = async (state: CreateSessionState) =>
  Either.encase(() => {
    if (
      !state ||
      !state.email ||
      !state.password ||
      !state.email.match(/@/) ||
      state.password.length < 6
    ) {
      throw new BadRequestError('bad user credentials provided')
    }

    return state
  })

export default validateSessionCreateRequest
