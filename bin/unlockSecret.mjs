'use strict'

import openpgp from 'openpgp'
import fs from 'fs'
import { Buffer } from 'buffer'
;(async () => {
  const environment = process.argv[2]
  const secret = process.argv[3]

  const fileContents = fs.readFileSync(`secrets/${environment}.env.enc`).toString()
  const binaryMessage = Buffer.from(fileContents, 'base64')

  const encryptedMessage = await openpgp.readMessage({
    binaryMessage,
  })

  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: secret,
    format: 'binary',
  })

  fs.writeFileSync(`secrets/${environment}.env`, Buffer.from(decrypted).toString())
})()
