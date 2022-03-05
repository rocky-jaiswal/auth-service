import bcrypt from 'bcrypt'

interface HasUserCredentials {
  email: string
  password: string
  encryptedPassword?: string
}

const comparePasswords = async (params: HasUserCredentials) => {
  const result = await bcrypt.compare(params.password, params.encryptedPassword!)

  if (!result) {
    throw new Error('Bad password!')
  }

  return params
}

export default comparePasswords
