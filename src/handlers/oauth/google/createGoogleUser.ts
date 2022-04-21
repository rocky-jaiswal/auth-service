import { FastifyReply, FastifyRequest } from 'fastify'
import { OAuth2Client } from 'google-auth-library'

import db from '../../../repositories/db'
import UserRepository from '../../../repositories/userRepository'
import signJWT from '../../../services/signJWT'

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URI
)

const GOOGLE_PEOPLE_API = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses'

const createGoogleUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const body = request.body as Record<string, string>
    const tokenResponse = await oAuth2Client.getToken(body.code)
    oAuth2Client.setCredentials(tokenResponse.tokens)

    const res = await oAuth2Client.request({
      url: GOOGLE_PEOPLE_API,
    })

    // TODO: Improve code here
    const responseData = res.data as any
    const email = responseData.emailAddresses[0].value

    const userRepo = new UserRepository(db)

    const maybeUser = await userRepo.findByEmail(email)

    const userPromise = maybeUser.caseOf({
      Just: (user) => Promise.resolve(user),
      Nothing: () => userRepo.createGoogleUser(email),
    })

    const user = await userPromise
    const token = signJWT(user.id)

    response.send({ token })
  } catch (e) {
    request.log.error('error in createGoogleUser')
    request.log.error(e)
    response.code(500).send({ error: 'error in createGoogleUser' })
  }
}

export default createGoogleUser
