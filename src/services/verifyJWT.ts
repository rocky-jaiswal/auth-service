import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const publicKeyPath = path.resolve(__dirname, `./../keys/public${process.env.KEY_SUFFIX}.pub`)
const publicKey = fs.readFileSync(publicKeyPath)

const verifyJWT = (token: string) => jwt.verify(token, publicKey)

export default verifyJWT
