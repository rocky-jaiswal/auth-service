import BadRequestError from '../errors/badRequestError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'

const validateSessionCreateRequest = async (state: CreateSessionState) => {
  // TODO: Test me
  if (
    !state ||
    !state.email ||
    !state.password ||
    !state.email.match(/@/) ||
    state.password.length < 6
  ) {
    throw new BadRequestError('Bad user credentials provided!')
  }

  return state
}

export default validateSessionCreateRequest
