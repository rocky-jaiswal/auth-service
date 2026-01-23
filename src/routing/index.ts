import { FastifyInstance, FastifyPluginOptions } from 'fastify'

import ping from '../handlers/health'
import createSession from '../handlers/sessions/create'
import createUser from '../handlers/users/create'
import getUser from '../handlers/users/get'

import createGoogleUser from '../handlers/oauth/google/createGoogleUser'
import createMicrosoftUser from '../handlers/oauth/microsoft/createMicrosoftUser'
import getGoogleAuthUrl from '../handlers/oauth/google/getGoogleAuthUrl'
import getMicrosoftAuthUrl from '../handlers/oauth/microsoft/getMicrosoftAuthUrl'

const routing = (server: FastifyInstance, _opts: FastifyPluginOptions, done: () => unknown) => {
  server.get('/ping', ping)
  server.get('/health', ping)

  server.post('/users', createUser)
  server.post('/sessions', createSession)
  server.get('/user', getUser)

  // Oauth stuff
  server.get('/login/google/url', getGoogleAuthUrl)
  server.post('/login/google', createGoogleUser)

  server.get('/login/microsoft/url', getMicrosoftAuthUrl)
  server.post('/login/microsoft', createMicrosoftUser)

  done()
}

export default routing
