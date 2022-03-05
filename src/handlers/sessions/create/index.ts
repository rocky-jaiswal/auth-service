import { pipeAsync } from '@rockyj/async-utils'
import { FastifyReply, FastifyRequest } from 'fastify'

import BadRequestError from '../../../errors/badRequestError'
import CreateSessionState from './createSessionState'

import validateSessionCreateRequest from '../../../actions/validateSessionCreateRequest'
import fetchUserFromDB from '../../../actions/fetchUserFromDB'
import comparePasswords from '../../../actions/comparePasswords'
import createToken from '../../../actions/createToken'

const createSession = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = CreateSessionState.create(request.body)

    const updatedState = await pipeAsync<CreateSessionState>(
      validateSessionCreateRequest,
      fetchUserFromDB({ shouldExist: true }),
      comparePasswords,
      createToken
    )(state)

    response.send({ token: updatedState.token })
  } catch (err) {
    request.log.error('Error in session creation')
    request.log.error({ err })
    if (err instanceof BadRequestError) {
      response.code(400).send({ error: err.message })
    } else {
      response.code(500).send({ error: 'Error in create session' })
    }
  }
}

export default createSession
