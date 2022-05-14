import { Right } from 'purify-ts'

import CreateSessionState from '../handlers/sessions/create/createSessionState'
import CreateUserState from '../handlers/users/create/createUserState'
import CreateGoogleUserState from '../handlers/oauth/google/createGoogleUserState'
import signJWT from '../services/signJWT'

const createToken = async (state: CreateSessionState | CreateUserState | CreateGoogleUserState) => {
  const token = signJWT(state.user!.id)

  state.token = token

  return Right(state)
}

export default createToken
