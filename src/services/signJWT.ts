import fs from 'fs'
import path from 'path'
import config from 'config'
import jwt from 'jsonwebtoken'

const privateKeyPath = path.resolve(
  __dirname,
  `./../keys/private${config.get('crypto.keysSuffix')}.pem`
)
const privateKey = fs.readFileSync(privateKeyPath)

const signJWT = (userId: string) =>
  jwt.sign(
    { id: userId },
    { key: privateKey, passphrase: config.get('secrets.jwtKey') },
    {
      algorithm: 'RS256',
      keyid: config.get('secrets.keyid'),
      audience: 'access',
      expiresIn: '1h',
    }
  )

export default signJWT
