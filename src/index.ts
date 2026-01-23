import 'dotenv/config'

import Fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'

import routing from './routing'

const port = parseInt(process.env.AUTH_SERVER_PORT || '3001')

// Initialize server instance
const server: FastifyInstance = Fastify({ logger: true })

// Setup routes
server.register(routing, { prefix: '/v1' })

// Static route
server.register(fastifyStatic, {
  root: path.join(__dirname, './public'),
})

// Startup
const start = async () => {
  try {
    await server.listen({ port, host: '::' })
  } catch (err) {
    server.log.error({ err })
    process.exit(1)
  }
}

start()
  .then(() => console.log('server started'))
  .catch(() => console.error('failed to start server'))
