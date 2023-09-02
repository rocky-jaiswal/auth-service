import { FastifyReply, FastifyRequest } from 'fastify'

import { getTimeStamp } from '../../services/utils'
import Db from '../../repositories/db'

const ping = async (request: FastifyRequest, response: FastifyReply) => {
  try {
    const date = await getTimeStamp(Db)

    response.send({ date })
  } catch (e) {
    request.log.error('error in healthcheck')
    request.log.error(e)
    response.code(500).send({ error: 'error in healthcheck' })
  }
}

export default ping
