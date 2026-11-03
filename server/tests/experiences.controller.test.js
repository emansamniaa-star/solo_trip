import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

const findAllExperiences = vi.fn()
const findExperienceById = vi.fn()
const createExperience = vi.fn()

vi.mock('../config/db.js', () => ({ sql: vi.fn() }))
vi.mock('../models/experience.model.js', () => ({
  findAllExperiences: (...a) => findAllExperiences(...a),
  findExperienceById: (...a) => findExperienceById(...a),
  createExperience: (...a) => createExperience(...a),
}))

describe('experiences API', () => {
  beforeEach(() => {
    vi.resetModules()
    findAllExperiences.mockReset()
    findExperienceById.mockReset()
    createExperience.mockReset()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('lists experiences', async () => {
    findAllExperiences.mockResolvedValue([{ id: 1, title: 'Safety tip' }])
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/experiences')
    expect(res.status).toBe(200)
    expect(res.body[0].title).toBe('Safety tip')
  })

  it('gets one experience', async () => {
    findExperienceById.mockResolvedValue({ id: 2, title: 'Ferry tip' })
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/experiences/2')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(2)
  })

  it('creates experience with auth', async () => {
    createExperience.mockResolvedValue({ id: 3, title: 'New tip', author: 'Eman' })
    const token = jwt.sign(
      { sub: 1, email: 'e@x.com', firstName: 'Eman' },
      'test-secret',
    )
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .post('/api/experiences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New tip',
        place: 'Amman',
        excerpt: 'Short',
        tag: 'Safety',
        body: 'Longer body text',
      })
    expect(res.status).toBe(201)
  })
})
