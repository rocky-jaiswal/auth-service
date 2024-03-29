import { FastifyReply, FastifyRequest } from 'fastify'
import { EitherAsync } from 'purify-ts'
import camelcaseKeys from 'camelcase-keys'

import { sendErrorResponse } from '../../../services/sendResponse'
import fetchEmailFromGoogle from '../../../actions/fetchEmailFromGoogle'
import fetchOrCreateGoogleUser from '../../../actions/fetchOrCreateGoogleUser'
import createToken from '../../../actions/createToken'
import CreateGoogleUserState from './createGoogleUserState'

const createGoogleUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const reqBody = camelcaseKeys(request.body ?? {})
    const state = await EitherAsync.liftEither(CreateGoogleUserState.create(reqBody))
      .chain(fetchEmailFromGoogle)
      .chain(fetchOrCreateGoogleUser)
      .chain(createToken)
      .run()

    state.caseOf({
      Left: (err) => {
        request.log.error(err)
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (state) => {
        response.code(200).send({ token: state.token })
      },
    })
  } catch (e) {
    request.log.error('error in createGoogleUser')
    request.log.error(e)
    response.code(500).send({ error: 'error in createGoogleUser' })
  }
}

export default createGoogleUser
