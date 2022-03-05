'use strict'

import { readFileSync, writeFileSync } from 'fs'
import { randomBytes, generateKeyPairSync } from 'crypto'
import { pem2jwk } from 'pem-jwk'
import { v4 as uuidv4 } from 'uuid'

const generateJwks = (environment, publicKeyPath) => {
  const jkwsBase = pem2jwk(readFileSync(publicKeyPath))
  const jwksEntry = Object.assign(
    {
      alg: 'RS256',
      use: 'sig',
      kid: uuidv4(),
    },
    jkwsBase
  )
  console.log(
    `Please update /public/.well-known/jwks.json with the following entry for the environment - ${environment}`
  )
  console.log('-----------------------------')
  console.log(JSON.stringify(jwksEntry))
  console.log('-----------------------------')
}

const generateKeyPair = (environment) => {
  const password = randomBytes(256).toString('hex').substr(0, 32)

  console.log(`Generating key for environment - ${environment}`)
  console.log(
    'Password below, please copy it and add it to secrets (as per the environment) manually:'
  )
  console.log('-----------------------------')
  console.log(password)
  console.log('-----------------------------')

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: password,
    },
  })

  const publicKeyPath = `./src/keys/public_${environment}.pub`
  const privateKeyPath = `./src/keys/private_${environment}.pem`

  console.log(`Writing to - ${publicKeyPath}`)
  console.log(`Writing to - ${privateKeyPath}`)

  writeFileSync(publicKeyPath, publicKey)
  writeFileSync(privateKeyPath, privateKey)

  // For test environment, do not generate JWKS
  if (environment !== 'test') {
    generateJwks(environment, publicKeyPath)
  }
}

const environment = process.argv[2]

if (!['development', 'test', 'staging', 'production'].includes(environment)) {
  console.error(
    'Invalid environment passed in - only development, test, staging, production allowed.'
  )
  process.exit(1)
}

generateKeyPair(environment)
