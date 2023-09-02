import bcrypt from 'bcrypt'
import { Left, Right } from 'purify-ts'

import BadRequestError from '../errors/badRequestError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'

const comparePasswords = async (state: CreateSessionState) => {
  const result = await bcrypt.compare(state.password, state.user!.encryptedPassword!)

  if (!result) {
    return Left(new BadRequestError('bad credentials'))
  }

  return Right(state)
}

export default comparePasswords
