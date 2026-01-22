import { Either } from 'purify-ts'

import User from '../../../models/user'
import BadRequestError from '../../../errors/badRequestError'

class CreateMicrosoftUserState {
  public readonly code: string

  public email?: string
  public user?: User
  public token?: string

  public static create(requestBody: unknown) {
    return Either.encase(() => {
      if (!requestBody) {
        throw new BadRequestError('invalid create microsoft user request')
      }

      const { code } = requestBody as Record<string, string>
      if (!code || code === '') {
        throw new BadRequestError('invalid microsoft code')
      }

      return new CreateMicrosoftUserState(code)
    })
  }

  private constructor(code: string) {
    this.code = code
  }
}

export default CreateMicrosoftUserState
