import { Either } from 'purify-ts'

import User from '../../../models/user'
import BadRequestError from '../../../errors/badRequestError'

class CreateSessionState {
  public readonly email: string
  public readonly password: string

  public user?: User
  public token?: string

  private constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  public static create(requestBody: unknown) {
    return Either.encase(() => {
      if (!requestBody) {
        throw new BadRequestError('invalid create session request')
      }

      const { email, password } = requestBody as Record<string, string>
      return new CreateSessionState(email, password)
    })
  }
}

export default CreateSessionState
