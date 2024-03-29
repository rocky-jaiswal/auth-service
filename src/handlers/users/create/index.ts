import { EitherAsync } from 'purify-ts'
import { FastifyRequest, FastifyReply } from 'fastify'
import camelcaseKeys from 'camelcase-keys'

import CreateUserState from './createUserState'

import { sendErrorResponse } from '../../../services/sendResponse'
import validateCreateUserRequest from '../../../actions/validateCreateUserRequest'
import ensureUserDoesNotExist from '../../../actions/ensureUserDoesNotExist'
import createUserInDB from '../../../actions/createUserInDB'
import createToken from '../../../actions/createToken'

const createUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const reqBody = camelcaseKeys(request.body ?? {})
    const state = await EitherAsync.liftEither(CreateUserState.create(reqBody))
      .chain(validateCreateUserRequest)
      .chain(ensureUserDoesNotExist)
      .chain(createUserInDB)
      .chain(createToken)
      .run()

    state.caseOf({
      Left: (err) => {
        request.log.warn(err)
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (state) => {
        response.code(201).send({ token: state.token })
      },
    })
  } catch (err) {
    request.log.error('error in user creation')
    request.log.error(err)
    response.code(500).send({ error: 'error in create user' })
  }
}

export default createUser
