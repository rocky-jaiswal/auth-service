import { FastifyReply, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import db from '../../../repositories/db'
import getUser from '.'
import createUser from '../../users/create'

let database: Knex | null = null

describe('session creation', () => {
  beforeAll(() => {
    database = db
  })

  afterAll(async () => {
    await database?.destroy()
  })

  beforeEach(async () => {
    await database?.raw('TRUNCATE TABLE users CASCADE')
  })

  test('request with no header', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      // no headers
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid get user request' })
  })

  test('request with no auth', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      headers: {},
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid request - bad authorization header' })
  })

  test('request with bad auth', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      headers: { authorization: '' },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid request - bad authorization header' })
  })

  test('malformed token', async () => {
    const email = 'rj@example.com'
    let token = ''

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: (obj: any) => (token = obj.token) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      headers: {
        authorization: `token ${token}-`,
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid request - bad token' })
  })

  test('deleted user', async () => {
    const email = 'rj@example.com'
    let token = ''

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: (obj: any) => (token = obj.token) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    // delete the user
    await database?.raw('TRUNCATE TABLE users CASCADE')

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      headers: {
        authorization: `token ${token}`,
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'user not found' })
  })

  test('success', async () => {
    const email = 'rj@example.com'
    let token = ''

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: (obj: any) => (token = obj.token) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      headers: {
        authorization: `token ${token}`,
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await getUser(request, reply)

    expect(code).toHaveBeenCalledWith(200)
    expect(send).toHaveBeenCalled()
  })
})
