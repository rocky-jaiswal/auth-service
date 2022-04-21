import { FastifyReply, FastifyRequest } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import url from 'url'

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URI
)

const getGoogleUserDetails = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const qs = new url.URL(request.url, process.env.BASE_URI).searchParams
    const code = qs.get('code')
    const tokenResponse = await oAuth2Client.getToken(code!)
    oAuth2Client.setCredentials(tokenResponse.tokens)

    const res = await oAuth2Client.request({
      url: 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses',
    })
    console.log(res.data)

    response.send({})
  } catch (e) {
    request.log.error('error in getGoogleUserDetails')
    request.log.error(e)
    response.code(500).send({ error: 'error in getGoogleUserDetails' })
  }
}

export default getGoogleUserDetails
