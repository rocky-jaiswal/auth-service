import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const privateKeyPath = path.resolve(__dirname, `./../keys/private${process.env.KEY_SUFFIX}.pem`)
const privateKey = fs.readFileSync(privateKeyPath)

const signJWT = (userId: string) =>
  jwt.sign(
    { id: userId },
    { key: privateKey, passphrase: process.env.KEY_SECRET || '' },
    {
      algorithm: 'RS256',
      keyid: process.env.KEY_ID,
      audience: 'access',
      expiresIn: '1h',
    }
  )

export default signJWT
