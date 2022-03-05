import BadRequestError from '../../../errors/badRequestError'

class CreateSessionState {
  public readonly email: string
  public readonly password: string

  public userId?: string
  public encryptedPassword?: string
  public token?: string

  private constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }

  public static create(requestBody: unknown) {
    if (!requestBody) {
      throw new BadRequestError('Invalid create user request')
    }

    const { email, password } = requestBody as Record<string, string>
    return new CreateSessionState(email, password)
  }
}

export default CreateSessionState
