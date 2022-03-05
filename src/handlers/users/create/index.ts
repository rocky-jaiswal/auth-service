import { pipeAsync } from '@rockyj/async-utils'
import { FastifyRequest, FastifyReply } from 'fastify'

import CreateUserState from './createUserState'
import BadRequestError from '../../../errors/badRequestError'

import validateCreateUserRequest from '../../../actions/validateCreateUserRequest'
import fetchUserFromDB from '../../../actions/fetchUserFromDB'
import createUserInDB from '../../../actions/createUserInDB'
import createToken from '../../../actions/createToken'

// TODO: In TS Error is lost in type :think:
const createUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = CreateUserState.create(request.body)

    const updatedState = await pipeAsync<CreateUserState>(
      validateCreateUserRequest,
      fetchUserFromDB({ shouldExist: false }),
      createUserInDB,
      createToken
    )(state)

    response.send({ token: updatedState.token })
  } catch (err) {
    request.log.error('Error in user creation')
    request.log.error({ err })
    if (err instanceof BadRequestError) {
      response.code(400).send({ error: err.message })
    } else {
      response.code(500).send({ error: 'Error in create user' })
    }
  }
}

export default createUser
