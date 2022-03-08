import Fastify, { FastifyInstance } from 'fastify'
import path from 'path'
import 'dotenv/config'

import routing from './routing'

// Initialize server instance
const server: FastifyInstance = Fastify({ logger: true })

// Setup routes
server.register(routing, { prefix: '/v1' })

// Static route
server.register(require('fastify-static'), {
  root: path.join(__dirname, './public'),
})

const port = process.env.SERVER_PORT || 3000

// Startup
const start = async () => {
  try {
    await server.listen(port, '0.0.0.0')
  } catch (err) {
    server.log.error({ err })
    process.exit(1)
  }
}

start()
  .then(() => console.log('server started'))
  .catch(() => console.error('failed to start server'))
