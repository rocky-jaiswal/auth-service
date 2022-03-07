import { EitherAsync, Left, Right } from 'purify-ts'
import { FastifyRequest, FastifyReply } from 'fastify'

import CreateUserState from './createUserState'

import { fetchUserByEmail } from '../../../services/fetchUserFromDB'
import { sendErrorResponse } from '../../../services/sendResponse'
import validateCreateUserRequest from '../../../actions/validateCreateUserRequest'
import createUserInDB from '../../../actions/createUserInDB'
import createToken from '../../../actions/createToken'
import BadRequestError from '../../../errors/badRequestError'

const createUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const state = await EitherAsync.liftEither(CreateUserState.create(request.body))
      .chain(validateCreateUserRequest)
      .chain(async (st) => {
        const user = await fetchUserByEmail(st.email)
        if (user.isNothing()) return Right(st)
        return Left(new BadRequestError('user already exists'))
      })
      .chain(createUserInDB)
      .chain(createToken)
      .run()

    state.caseOf({
      Left: (err) => {
        const res = sendErrorResponse(err)
        response.code(res.code).send({ error: res.message })
      },
      Right: (state) => {
        response.send({ token: state.token })
      },
    })
  } catch (err) {
    request.log.error('error in user creation')
    request.log.error({ err })
    response.code(500).send({ error: 'error in create user' })
  }
}

export default createUser
