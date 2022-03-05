import fs from 'fs'
import path from 'path'
import config from 'config'
import jwt from 'jsonwebtoken'

const publicKeyPath = path.resolve(
  __dirname,
  `./../keys/public${config.get('crypto.keysSuffix')}.pub`
)
const publicKey = fs.readFileSync(publicKeyPath)

const verifyJWT = (token: string) => jwt.verify(token, publicKey)

export default verifyJWT
