import BadRequestError from '../errors/badRequestError'

import CreateSessionState from '../handlers/sessions/create/createSessionState'
import CreateUserState from '../handlers/users/create/createUserState'
import GetUserState from '../handlers/users/get/getUserState'

import db from '../repositories/db'
import UserRepository from '../repositories/userRepository'

interface CheckType {
  shouldExist: boolean
  findBy: 'email' | 'id'
}

const fetchUserFromDB =
  (check: CheckType) => async (state: CreateUserState | CreateSessionState | GetUserState) => {
    let user

    // TODO: DI for DB
    if (check.findBy === 'email') {
      user = await new UserRepository(db).findByEmail(state.email)
    }
    if (check.findBy === 'id') {
      user = await new UserRepository(db).findById(state.userId)
    }

    if (!check.shouldExist && user) {
      throw new BadRequestError('Invalid user request - user exists already')
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
