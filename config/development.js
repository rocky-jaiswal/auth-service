const fs = require('fs')
const yaml = require('js-yaml')

const secretFileName = `./secrets/${process.env.NODE_ENV}.yaml`
const secrets = yaml.load(fs.readFileSync(secretFileName, 'utf8'))

module.exports = {
  server: {
    port: 3001,
  },
  crypto: {
    keysSuffix: '_development',
  },
  ...secrets,
}
