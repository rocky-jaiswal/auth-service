class User {
  public readonly id: string
  public readonly email: string
  public readonly encryptedPassword: string

  constructor(id: string, email: string, encryptedPassword: string) {
    this.id = id
    this.email = email
    this.encryptedPassword = encryptedPassword
  }

  public static create(id: string, email: string, encryptedPassword: string) {
    return new User(id, email, encryptedPassword)
  }
}

export default User
