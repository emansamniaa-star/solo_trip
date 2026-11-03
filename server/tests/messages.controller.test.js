import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

const listConversationsForUser = vi.fn()
const getConversationMeta = vi.fn()
const listMessages = vi.fn()
const userInConversation = vi.fn()
const createMessage = vi.fn()
const createConversation = vi.fn()

vi.mock('../config/db.js', () => ({ sql: vi.fn() }))
vi.mock('../models/message.model.js', () => ({
  listConversationsForUser: (...a) => listConversationsForUser(...a),
  getConversationMeta: (...a) => getConversationMeta(...a),
  listMessages: (...a) => listMessages(...a),
  userInConversation: (...a) => userInConversation(...a),
  createMessage: (...a) => createMessage(...a),
  createConversation: (...a) => createConversation(...a),
}))

function tokenFor(id = 1, firstName = 'Eman') {
  return jwt.sign({ sub: id, email: 'e@x.com', firstName }, 'test-secret')
}

describe('messages API', () => {
  beforeEach(() => {
    vi.resetModules()
    listConversationsForUser.mockReset()
    getConversationMeta.mockReset()
    listMessages.mockReset()
    userInConversation.mockReset()
    createMessage.mockReset()
    createConversation.mockReset()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('requires auth for conversation list', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/messages')
    expect(res.status).toBe(401)
  })

  it('lists conversations for the user', async () => {
    listConversationsForUser.mockResolvedValue([
      {
        id: 1,
        withUser: 'Nour',
        tripLabel: 'Marrakech',
        lastMessage: 'Hi',
        updatedAt: new Date('2026-10-28'),
      },
    ])
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${tokenFor()}`)
    expect(res.status).toBe(200)
    expect(res.body[0].withUser).toBe('Nour')
  })

  it('returns a thread with fromMe flags', async () => {
    getConversationMeta.mockResolvedValue({
      id: 2,
      withUser: 'Sara',
      tripLabel: 'Istanbul',
    })
    listMessages.mockResolvedValue([
      { id: 10, senderId: 9, text: 'Hello' },
      { id: 11, senderId: 1, text: 'Hi back' },
    ])
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .get('/api/messages/2')
      .set('Authorization', `Bearer ${tokenFor(1)}`)
    expect(res.status).toBe(200)
    expect(res.body.messages[0].fromMe).toBe(false)
    expect(res.body.messages[1].fromMe).toBe(true)
  })

  it('sends a message', async () => {
    userInConversation.mockResolvedValue(true)
    createMessage.mockResolvedValue({ id: 20, text: 'See you there' })
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .post('/api/messages/2/messages')
      .set('Authorization', `Bearer ${tokenFor(1)}`)
      .send({ text: 'See you there' })
    expect(res.status).toBe(201)
    expect(res.body.fromMe).toBe(true)
  })
})
