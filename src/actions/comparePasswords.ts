import bcrypt from 'bcrypt'

import BadRequestError from '../errors/badRequestError'

interface HasUserCredentials {
  email: string
  password: string
  encryptedPassword?: string
}

const comparePasswords = async (state: HasUserCredentials) => {
  const result = await bcrypt.compare(state.password, state.encryptedPassword!)

  if (!result) {
    throw new BadRequestError('Bad credentials!')
  }

  return state
}

export default comparePasswords
