import { FastifyReply, FastifyRequest } from 'fastify'
import { EitherAsync } from 'purify-ts'

import { sendErrorResponse } from '../../../services/sendResponse'
import signJWT from '../../../services/signJWT'
import fetchEmailFromGoogle from '../../../actions/fetchEmailFromGoogle'
import fetchOrCreateGoogleUser from '../../../actions/fetchOrCreateGoogleUser'
import CreateGoogleUserState from './createGoogleUserState'

const createGoogleUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = await EitherAsync.liftEither(CreateGoogleUserState.create(request.body))
      .chain(fetchEmailFromGoogle)
      .chain(fetchOrCreateGoogleUser)
      .run()

    state.caseOf({
      Left: (err) => {
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (state) => {
        response.code(200).send({ token: signJWT(state.user!.id) })
      },
    })
  } catch (e) {
    request.log.error('error in createGoogleUser')
    request.log.error(e)
    response.code(500).send({ error: 'error in createGoogleUser' })
  }
}

export default createGoogleUser
