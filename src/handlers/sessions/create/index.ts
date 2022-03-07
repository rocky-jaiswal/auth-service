import { EitherAsync } from 'purify-ts'
import { FastifyReply, FastifyRequest } from 'fastify'

import CreateSessionState from './createSessionState'

import validateSessionCreateRequest from '../../../actions/validateSessionCreateRequest'
import checkIfUserExists from '../../../actions/checkIfUserExists'
import comparePasswords from '../../../actions/comparePasswords'
import createToken from '../../../actions/createToken'

const createSession = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = await EitherAsync.liftEither(CreateSessionState.create(request.body))
      .chain(validateSessionCreateRequest)
      .chain(checkIfUserExists)
      .chain(comparePasswords)
      .chain(createToken)
      .run()

    state.caseOf({
      Left: (err) => response.code(400).send({ error: err.message }),
      Right: (state) => {
        response.send({ token: state.token })
        return {}
      },
    })
  } catch (err) {
    request.log.error('Error in session creation')
    request.log.error({ err })
    response.code(500).send({ error: 'Error in create session' })
  }
}

export default createSession
