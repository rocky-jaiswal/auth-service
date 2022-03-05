import { FastifyReply, FastifyRequest } from 'fastify'

const getUser = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    // TODO: Extract user id somehow from token header, and query db for email by user id
    response.send({})
  } catch (err) {
    request.log.error('Error in user fetch')
    request.log.error({ err })
    // TODO: Better error code
    response.code(500).send({ error: 'error in get-user' })
  }
}

export default getUser
