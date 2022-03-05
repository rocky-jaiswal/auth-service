import { FastifyReply, FastifyRequest } from 'fastify'

import Db from '../repositories/db'
import { getTimeStamp } from '../services/utils'

const ping = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const date = await getTimeStamp(Db)

    response.send({ date })
  } catch (e) {
    request.log.error('Error in healthcheck')
    request.log.error(e)
    response.code(500).send({ error: 'error in healthcheck' + e.message })
  }
}

export default ping
