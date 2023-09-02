import { FastifyReply, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import db from '../../../repositories/db'
import createSession from '.'
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

  test('request with no body', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      // no body
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create session request' })
  })

  test('request with no email', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        password: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'bad user credentials provided' })
  })

  test('request with no password', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email: 'rj@example.com',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'bad user credentials provided' })
  })

  test('request with bad email', async () => {
    const email = 'rj@example.com'

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: () => ({}) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email: 'rj2@example.com',
        password: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'user does not exist' })
  })

  test('request with bad password', async () => {
    const email = 'rj@example.com'

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: () => ({}) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email,
        password: '1234567',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'bad credentials' })
  })

  test('success', async () => {
    const email = 'rj@example.com'

    const requestCreate = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const replyCreate = {
      code: () => ({ send: () => ({}) }),
    } as unknown as FastifyReply

    await createUser(requestCreate, replyCreate)
    const users = await database!('users').select('email')
    expect(users.length).toBe(1)

    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email,
        password: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createSession(request, reply)

    expect(code).toHaveBeenCalledWith(200)
    expect(send).toHaveBeenCalled()
  })
})
