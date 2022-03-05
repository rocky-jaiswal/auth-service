import CreateUserState from '../handlers/users/create/createUserState'

// TODO: Test this
const validateCreateUserRequest = async (params: CreateUserState) => {
  if (
    !params.email.match(/@/) ||
    params.password.length < 6 ||
    params.password !== params.confirmedPassword
  ) {
    throw new Error('Bad user credentials provided!')
  }

  return params
}

export default validateCreateUserRequest
