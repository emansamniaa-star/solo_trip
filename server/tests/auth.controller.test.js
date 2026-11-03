import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'

const createUser = vi.fn()
const findUserByEmail = vi.fn()

vi.mock('../config/db.js', () => ({
  sql: vi.fn(),
}))

vi.mock('../models/user.model.js', () => ({
  createUser: (...args) => createUser(...args),
  findUserByEmail: (...args) => findUserByEmail(...args),
}))

describe('auth API', () => {
  beforeEach(() => {
    vi.resetModules()
    createUser.mockReset()
    findUserByEmail.mockReset()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('registers a user and returns a token', async () => {
    createUser.mockResolvedValue({
      id: 1,
      firstName: 'Eman',
      email: 'eman@example.com',
      city: 'Jerusalem',
    })
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/register').send({
      firstName: 'Eman',
      city: 'Jerusalem',
      email: 'eman@example.com',
      password: 'secret1',
      travelStyle: 'Cultural',
    })
    expect(res.status).toBe(201)
    expect(res.body.user.firstName).toBe('Eman')
    expect(res.body.token).toBeTruthy()
    expect(res.body.user.passwordHash).toBeUndefined()
  })

  it('rejects short password', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/register').send({
      firstName: 'Eman',
      city: 'Jerusalem',
      email: 'eman@example.com',
      password: '123',
    })
    expect(res.status).toBe(400)
  })

  it('logs in with valid password and returns a token', async () => {
    const passwordHash = await bcrypt.hash('secret1', 10)
    findUserByEmail.mockResolvedValue({
      id: 1,
      firstName: 'Eman',
      email: 'eman@example.com',
      city: 'Jerusalem',
      bio: '',
      travelStyle: 'Cultural',
      passwordHash,
    })
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/login').send({
      email: 'eman@example.com',
      password: 'secret1',
    })
    expect(res.status).toBe(200)
    expect(res.body.user.firstName).toBe('Eman')
    expect(res.body.token).toBeTruthy()
  })

  it('rejects bad login', async () => {
    findUserByEmail.mockResolvedValue(null)
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/login').send({
      email: 'missing@example.com',
      password: 'secret1',
    })
    expect(res.status).toBe(401)
  })
})
