import BadRequestError from '../errors/badRequestError'

export const sendErrorResponse = (err: Error) => {
  if (err instanceof BadRequestError) {
    return { code: 400, message: err.message }
  }
  return { code: 500, message: err.message }
}
