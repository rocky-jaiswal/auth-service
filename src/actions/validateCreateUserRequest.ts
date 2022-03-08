import { Either } from 'purify-ts'
import BadRequestError from '../errors/badRequestError'
import CreateUserState from '../handlers/users/create/createUserState'

// TODO: Test this
const validateCreateUserRequest = async (state: CreateUserState) =>
  Either.encase(() => {
    if (
      !state.email ||
      !state.password ||
      !state.confirmedPassword ||
      !state.email.match(/@/) ||
      state.password.length < 6 ||
      state.password !== state.confirmedPassword
    ) {
      throw new BadRequestError('invalid create user request')
    }

    return state
  })

export default validateCreateUserRequest
