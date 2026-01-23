import { FastifyReply, FastifyRequest } from 'fastify'

const getMicrosoftAuthUrl = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common'
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      redirect_uri: process.env.MICROSOFT_CALLBACK_URI!,
      response_type: 'code',
      scope: 'user.read',
      response_mode: 'query',
    })

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`

    response.code(200).send({ url: authUrl })
  } catch (e) {
    request.log.error('error in getMicrosoftAuthUrl')
    request.log.error(e)
    response.code(500).send({ error: 'error generating microsoft auth url' })
  }
}

export default getMicrosoftAuthUrl
