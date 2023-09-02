import { FastifyReply, FastifyRequest } from 'fastify'
import type { Knex } from 'knex'

import db from '../../../repositories/db'
import createUser from '.'

let database: Knex | null = null

describe('user creation', () => {
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

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
  })

  test('request with no email', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
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

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
  })

  test('request with bad email', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email: 'rjexample.com',
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
  })

  test('request with bad password', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email: 'rj@example.com',
        password: '123',
        confirmedPassword: '123',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
  })

  test('request with bad password confirmation', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    const request = {
      body: {
        email: 'rj@example.com',
        password: '123456',
        confirmedPassword: '1234567',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'invalid create user request' })
  })

  test('request with existing user', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))

    await database?.raw(
      "INSERT INTO users(email, encrypted_password) values('rj@example.com', 'foobar')"
    )

    const request = {
      body: {
        email: 'rj@example.com',
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({ error: 'user already exists' })
  })

  test('success', async () => {
    const send = jest.fn()
    const code = jest.fn(() => ({ send }))
    const email = 'rj@example.com'

    const request = {
      body: {
        email,
        password: '123456',
        confirmedPassword: '123456',
      },
      log: console,
    } as unknown as FastifyRequest

    const reply = {
      code,
    } as unknown as FastifyReply

    await createUser(request, reply)

    expect(code).toHaveBeenCalledWith(201)
    expect(send).toHaveBeenCalled()

    const users = await database!('users').select('email')
    expect(users.length).toBe(1)
    expect(users[0].email).toBe(email)
  })
})
