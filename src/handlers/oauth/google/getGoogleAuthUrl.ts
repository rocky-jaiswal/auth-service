import { FastifyReply, FastifyRequest } from 'fastify'

const getGoogleAuthUrl = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URI!,
      response_type: 'code',
      scope: 'profile https://www.googleapis.com/auth/user.emails.read',
      access_type: 'offline',
      prompt: 'consent',
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    response.code(200).send({ url: authUrl })
  } catch (e) {
    request.log.error('error in getGoogleAuthUrl')
    request.log.error(e)
    response.code(500).send({ error: 'error generating google auth url' })
  }
}

export default getGoogleAuthUrl
