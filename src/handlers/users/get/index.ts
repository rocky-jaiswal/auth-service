import { Either, EitherAsync } from 'purify-ts'
import { FastifyReply, FastifyRequest } from 'fastify'

import { fetchUserById } from '../../../services/fetchUserFromDB'
import { sendErrorResponse } from '../../../services/sendResponse'
import User from '../../../models/user'
import GetUserState from './getUserState'
import validateToken from '../../../actions/validateToken'
import validateGetUserRequest from '../../../actions/validateGetUserRequest'

const getUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = await EitherAsync.liftEither(GetUserState.create(request.headers, request.log))
      .chain(validateGetUserRequest)
      .chain(validateToken)
      .chain(async (getUserState) => {
        const user = (await fetchUserById(true)(getUserState.userId!)) as Either<Error, User>
        getUserState.user = user.isRight() ? user.extract() : undefined
        return user
      })
      .run()

    state.caseOf({
      Left: (err) => {
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (user) => {
        response.code(200).send({ userId: user.id, email: user.email })
      },
    })
  } catch (err) {
    request.log.error('error in user fetch')
    request.log.error(err)
    response.code(500).send({ error: 'error in create user' })
  }
}

export default getUser
