import CreateSessionState from '../handlers/sessions/create/createSessionState'
import signJWT from '../services/signJWT'

const createToken = async (state: CreateSessionState) => {
  const token = signJWT(state.userId!)

  state.token = token

  return state
}

export default createToken
