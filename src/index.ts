import 'dotenv/config'

import Fastify, { FastifyInstance } from 'fastify'
import path from 'path'
import fastifyOauth2 from 'fastify-oauth2'

import routing from './routing'

// Initialize server instance
const server: FastifyInstance = Fastify({ logger: true })

// Setup routes
server.register(routing, { prefix: '/v1' })

// Static route
server.register(require('fastify-static'), {
  root: path.join(__dirname, './public'),
})

// Oauth
server.register(fastifyOauth2, {
  name: 'googleOAuth2',
  scope: ['profile', 'https://www.googleapis.com/auth/user.emails.read'],
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID!,
      secret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login/google',
  callbackUri: process.env.GOOGLE_CALLBACK_URI!,
})

const port = process.env.SERVER_PORT || 3001

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
