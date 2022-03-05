import BadRequestError from '../errors/badRequestError'
import CreateSessionState from '../handlers/sessions/create/createSessionState'
import CreateUserState from '../handlers/users/create/createUserState'
import db from '../repositories/db'
import User from '../repositories/user'

interface CheckType {
  shouldExist: boolean
}

const fetchUserFromDB =
  (check: CheckType) => async (state: CreateUserState | CreateSessionState) => {
    // TODO: DI for DB & User model creation
    const user = await new User(db).findByEmail(state.email)

    if (!check.shouldExist && user) {
      throw new BadRequestError('Invalid create user request - user exists already')
    }

    if (check.shouldExist && !user) {
      throw new BadRequestError('Invalid user request - user not found')
    }

    if (check.shouldExist) {
      // TODO: This needs to be tested / mixed case
      state.userId = user.id as string
      state.encryptedPassword = user.encrypted_password as string
    }

    return state
  }

export default fetchUserFromDB
