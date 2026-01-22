import { Either, Left, Right } from 'purify-ts'
import { ConfidentialClientApplication } from '@azure/msal-node'

import ServerError from '../errors/serverError'
import CreateMicrosoftUserState from '../handlers/oauth/microsoft/createMicrosoftUserState'

const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
  },
}

const msalClient = new ConfidentialClientApplication(msalConfig)

const MICROSOFT_GRAPH_API = 'https://graph.microsoft.com/v1.0/me'

const fetchEmailFromMicrosoft = async (
  state: CreateMicrosoftUserState
): Promise<Either<Error, CreateMicrosoftUserState>> => {
  try {
    const tokenRequest = {
      code: state.code,
      scopes: ['user.read'],
      redirectUri: process.env.MICROSOFT_CALLBACK_URI!,
    }

    const tokenResponse = await msalClient.acquireTokenByCode(tokenRequest)

    if (!tokenResponse?.accessToken) {
      return Left(new ServerError('failed to acquire access token'))
    }

    const response = await fetch(MICROSOFT_GRAPH_API, {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    })

    if (!response.ok) {
      return Left(new ServerError('failed to fetch user profile'))
    }

    const userData = (await response.json()) as { mail?: string; userPrincipalName?: string }

    // Microsoft returns email in either 'mail' or 'userPrincipalName' field
    state.email = userData.mail || userData.userPrincipalName

    if (!state.email) {
      return Left(new ServerError('no email found in microsoft profile'))
    }

    return Right(state)
  } catch (err) {
    // TODO: Log this error
    // console.log(err)

    return Left(new ServerError('server error'))
  }
}

export default fetchEmailFromMicrosoft
