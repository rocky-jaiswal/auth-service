import { EitherAsync } from 'purify-ts'
import { FastifyReply, FastifyRequest } from 'fastify'

import CreateSessionState from './createSessionState'

import { sendErrorResponse } from '../../../services/sendResponse'
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
      Left: (err) => {
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (state) => {
        response.code(200).send({ token: state.token })
      },
    })
  } catch (err) {
    request.log.error('error in session creation')
    request.log.error(err)
    response.code(500).send({ error: 'error in create session' })
  }
}

export default createSession
