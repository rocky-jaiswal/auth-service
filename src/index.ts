import Fastify, { FastifyInstance } from 'fastify'
import config from 'config'
import path from 'path'

import routing from './routing'

// Initialize server instance
const server: FastifyInstance = Fastify({ logger: true })

// Setup routes
server.register(routing, { prefix: '/v1' })

// Static route
server.register(require('fastify-static'), {
  root: path.join(__dirname, './public'),
})

// Startup
const start = async () => {
  try {
    await server.listen(config.get('server.port'), '0.0.0.0')
  } catch (err) {
    server.log.error({ err })
    process.exit(1)
  }
}

start()
  .then(() => console.log('server started'))
  .catch(() => console.error('failed to start server'))
