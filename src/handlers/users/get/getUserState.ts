import { Either } from 'purify-ts'
import { FastifyLoggerInstance } from 'fastify'
import { IncomingHttpHeaders } from 'http'

import BadRequestError from '../../../errors/badRequestError'
import User from '../../../models/user'

class GetUserState {
  public readonly authorization?: string
  public readonly logger: FastifyLoggerInstance

  public token?: string
  public userId?: string
  public user?: User

  public static create(requestHeaders: IncomingHttpHeaders, logger: FastifyLoggerInstance) {
    return Either.encase(() => {
      if (!requestHeaders) {
        throw new BadRequestError('invalid get user request')
      }
      return new GetUserState(logger, requestHeaders.authorization)
    })
  }

  private constructor(logger: FastifyLoggerInstance, authorization?: string) {
    this.authorization = authorization
    this.logger = logger
  }
}

export default GetUserState
