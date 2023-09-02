import { Either } from 'purify-ts'

import User from '../../../models/user'
import BadRequestError from '../../../errors/badRequestError'

class CreateUserState {
  public readonly email: string
  public readonly password: string
  public readonly confirmedPassword?: string

  public user?: User
  public token?: string

  public static create(requestBody: unknown) {
    return Either.encase(() => {
      if (!requestBody) {
        throw new BadRequestError('invalid create user request')
      }

      const { email, password, confirmedPassword } = requestBody as Record<string, string>
      return new CreateUserState(email, password, confirmedPassword)
    })
  }

  private constructor(email: string, password: string, confirmedPassword: string) {
    this.email = email
    this.password = password
    this.confirmedPassword = confirmedPassword
  }
}

export default CreateUserState
