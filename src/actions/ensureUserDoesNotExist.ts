import { Either, Right, Left } from 'purify-ts'

import { fetchUserByEmail } from '../services/fetchUserFromDB'
import BadRequestError from '../errors/badRequestError'
import CreateUserState from '../handlers/users/create/createUserState'

const ensureUserDoesNotExist = async (
  st: CreateUserState
): Promise<Either<BadRequestError, CreateUserState>> => {
  const user = await fetchUserByEmail(st.email)
  if (user.isNothing()) return Right(st)
  return Left(new BadRequestError('user already exists'))
}

export default ensureUserDoesNotExist
