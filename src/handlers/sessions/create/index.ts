import { pipeAsync } from '@rockyj/async-utils'
import { FastifyReply, FastifyRequest } from 'fastify'

import fetchUserFromDB from '../../../actions/fetchUserFromDB'
import comparePasswords from '../../../actions/comparePasswords'
import createToken from '../../../actions/createToken'

export class CreateSessionState {
  public readonly email: string
  public readonly password: string

  public createdUserId?: string
  public encryptedPassword?: string
  public token?: string

  public constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}

const validateRequest = async (params: CreateSessionState) => {
  // TODO: Test me and move to a module
  if (!params.email || !params.password || !params.email.match(/@/) || params.password.length < 6) {
    throw new Error('Bad user credentials provided!')
  }

  return params
}

const createSession = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const { email, password } = request.body as Record<string, string>

    const state = new CreateSessionState(email, password)

    const updatedState = await pipeAsync<CreateSessionState>(
      validateRequest,
      fetchUserFromDB,
      comparePasswords,
      createToken
    )(state)

    response.send({ token: updatedState.token })
  } catch (err) {
    request.log.error('Error in user creation')
    request.log.error({ err })
    // TODO: Better error code
    response.code(500).send({ error: 'error in create-user' })
  }
}

export default createSession
