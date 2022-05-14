import { Either } from 'purify-ts'

import User from '../../../models/user'
import BadRequestError from '../../../errors/badRequestError'

class CreateGoogleUserState {
  public readonly code: string

  public email?: string
  public user?: User
  public token?: string

  public static create(requestBody: unknown) {
    return Either.encase(() => {
      if (!requestBody) {
        throw new BadRequestError('invalid create google user request')
      }

      const { code } = requestBody as Record<string, string>
      if (!code || code === '') {
        throw new BadRequestError('invalid google code')
      }

      return new CreateGoogleUserState(code)
    })
  }

  private constructor(code: string) {
    this.code = code
  }
}

export default CreateGoogleUserState
