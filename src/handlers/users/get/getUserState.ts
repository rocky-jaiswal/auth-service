import { FastifyLoggerInstance } from 'fastify'
import { IncomingHttpHeaders } from 'http'
import BadRequestError from '../../../errors/badRequestError'

class GetUserState {
  public readonly authorization?: string
  public readonly logger: FastifyLoggerInstance

  public token?: string
  public userId?: string
  public userEmail?: string

  public static create(requestHeaders: IncomingHttpHeaders, logger: FastifyLoggerInstance) {
    if (!requestHeaders) {
      throw new BadRequestError('Invalid get user request')
    }

    return new GetUserState(logger, requestHeaders.authorization)
  }

  private constructor(logger: FastifyLoggerInstance, authorization?: string) {
    this.authorization = authorization
    this.logger = logger
  }
}

export default GetUserState
