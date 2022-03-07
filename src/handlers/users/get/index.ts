import { Either, EitherAsync } from 'purify-ts'
import { FastifyReply, FastifyRequest } from 'fastify'

import { fetchUserById } from '../../../services/fetchUserFromDB'
import validateToken from '../../../actions/validateToken'
import validateGetUserRequest from '../../../actions/validateGetUserRequest'
import User from '../../../models/user'
import GetUserState from './getUserState'

const getUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = await EitherAsync.liftEither(GetUserState.create(request.headers, request.log))
      .chain(validateGetUserRequest)
      .chain(validateToken)
      .chain(async (st) => {
        const user = (await fetchUserById(true)(st.userId!)) as Either<Error, User>
        st.user = user.isRight() ? user.extract() : undefined
        return user
      })
      .run()

    state.caseOf({
      Left: (err) => response.code(400).send({ error: err.message }),
      Right: (user) => {
        response.send({ userId: user.id, email: user.email })
        return {}
      },
    })
  } catch (err) {
    request.log.error('Error in user fetch')
    request.log.error({ err })
    response.code(500).send({ error: 'Error in create user' })
  }
}

export default getUser
