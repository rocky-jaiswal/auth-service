import BadRequestError from '../../../errors/badRequestError'

class CreateUserState {
  public readonly email: string
  public readonly password: string
  public readonly confirmedPassword?: string

  public userId?: string
  public token?: string

  public static create(requestBody: unknown) {
    if (!requestBody) {
      throw new BadRequestError('Invalid create user request')
    }

    const { email, password, confirmedPassword } = requestBody as Record<string, string>
    return new CreateUserState(email, password, confirmedPassword)
  }

  private constructor(email: string, password: string, confirmedPassword: string) {
    this.email = email
    this.password = password
    this.confirmedPassword = confirmedPassword
  }
}

export default CreateUserState
