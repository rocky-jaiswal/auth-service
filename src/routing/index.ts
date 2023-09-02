import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import ping from '../handlers/health'
import createSession from '../handlers/sessions/create'
import createUser from '../handlers/users/create'
import getUser from '../handlers/users/get'

import createGoogleUser from '../handlers/oauth/google/createGoogleUser'

const routing = (server: FastifyInstance, _opts: FastifyPluginOptions, done: Function) => {
  server.get('/ping', ping)

  server.post('/users', createUser)
  server.post('/sessions', createSession)
  server.get('/user', getUser)

  // Oauth stuff
  server.post('/login/google', createGoogleUser)

  done()
}

export default routing
