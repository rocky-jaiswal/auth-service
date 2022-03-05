import signJWT from '../services/signJWT'

interface HasId {
  email: string
  password: string
  createdUserId?: string
  token?: string
}

const createToken = async (params: HasId) => {
  const token = signJWT(params.createdUserId!!)

  params.token = token

  return params
}

export default createToken
