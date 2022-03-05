import db from '../repositories/db'
import User from '../repositories/user'

interface HasUserCredentials {
  email: string
  password: string
  userId?: string
  encryptedPassword?: string
}

const fetchUserFromDB = async (params: HasUserCredentials) => {
  // TODO: DI for DB
  const obj = await new User(db).findByEmail(params.email)

  // TODO: This needs to be tested
  params.userId = obj.id as string
  params.encryptedPassword = obj.encrypted_password as string

  return params
}

export default fetchUserFromDB
