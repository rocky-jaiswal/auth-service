import { FastifyReply, FastifyRequest } from 'fastify'
import { EitherAsync } from 'purify-ts'
import camelcaseKeys from 'camelcase-keys'

import { sendErrorResponse } from '../../../services/sendResponse'
import fetchEmailFromMicrosoft from '../../../actions/fetchEmailFromMicrosoft'
import fetchOrCreateMicrosoftUser from '../../../actions/fetchOrCreateMicrosoftUser'
import createToken from '../../../actions/createToken'
import CreateMicrosoftUserState from './createMicrosoftUserState'

const createMicrosoftUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const reqBody = camelcaseKeys(request.body ?? {})
    const state = await EitherAsync.liftEither(CreateMicrosoftUserState.create(reqBody))
      .chain(fetchEmailFromMicrosoft)
      .chain(fetchOrCreateMicrosoftUser)
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
    request.log.error('error in createMicrosoftUser')
    request.log.error(e)
    response.code(500).send({ error: 'error in createMicrosoftUser' })
  }
}

export default createMicrosoftUser
