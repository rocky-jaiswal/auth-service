class ServerError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export default ServerError
