import { Either, Left, Right } from 'purify-ts'
import { OAuth2Client } from 'google-auth-library'

import ServerError from '../errors/serverError'
import CreateGoogleUserState from '../handlers/oauth/google/createGoogleUserState'

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URI
)

const GOOGLE_PEOPLE_API = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses'

const fetchEmailFromGoogle = async (
  state: CreateGoogleUserState
): Promise<Either<Error, CreateGoogleUserState>> => {
  try {
    const tokenResponse = await oAuth2Client.getToken(state.code)
    oAuth2Client.setCredentials(tokenResponse.tokens)

    const res = await oAuth2Client.request({
      url: GOOGLE_PEOPLE_API,
    })

    const responseData = res.data as any
    state.email = responseData.emailAddresses[0].value

    return Right(state)
  } catch (err) {
    // TODO: Log this error
    return Left(new ServerError('server error'))
  }
}

export default fetchEmailFromGoogle
