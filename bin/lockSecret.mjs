'use strict'

import { Buffer } from 'buffer'
import openpgp from 'openpgp'
import fs from 'fs'
;(async () => {
  const environment = process.argv[2]
  const secret = process.argv[3]

  const file = fs.readFileSync(`secrets/${environment}.env`)
  const message = await openpgp.createMessage({ binary: Buffer.from(file) })

  const encrypted = await openpgp.encrypt({
    message,
    passwords: secret,
    format: 'binary',
  })

  fs.writeFileSync(`secrets/${environment}.env.enc`, Buffer.from(encrypted).toString('base64'))
})()
