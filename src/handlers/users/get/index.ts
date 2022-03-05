import { pipeAsync } from '@rockyj/async-utils'
import { FastifyReply, FastifyRequest } from 'fastify'

import BadRequestError from '../../../errors/badRequestError'
import validateGetUserRequest from '../../../actions/validateGetUserRequest'
import validateToken from '../../../actions/validateToken'
import fetchUserFromDB from '../../../actions/fetchUserFromDB'
import GetUserState from './getUserState'

const getUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = GetUserState.create(request.headers, request.log)

    const updatedState = await pipeAsync<GetUserState>(
      validateGetUserRequest,
      validateToken,
      fetchUserFromDB({ shouldExist: true, findBy: 'id' })
    )(state)

    response.send({ userId: updatedState.userId, email: updatedState.userEmail })
  } catch (err) {
    request.log.error('Error in user fetch')
    request.log.error({ err })
    if (err instanceof BadRequestError) {
      response.code(400).send({ error: err.message })
    } else {
      response.code(500).send({ error: 'Error in create user' })
    }
  }
}

export default getUser
