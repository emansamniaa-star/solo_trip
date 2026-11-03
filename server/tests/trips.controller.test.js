import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

const findAllTrips = vi.fn()
const findTripById = vi.fn()
const createTrip = vi.fn()

vi.mock('../config/db.js', () => ({
  sql: vi.fn(),
}))

vi.mock('../models/trip.model.js', () => ({
  findAllTrips: (...args) => findAllTrips(...args),
  findTripById: (...args) => findTripById(...args),
  createTrip: (...args) => createTrip(...args),
}))

function authHeader() {
  const token = jwt.sign(
    { sub: 7, email: 'eman@example.com', firstName: 'Eman' },
    'test-secret',
    { expiresIn: '1h' },
  )
  return `Bearer ${token}`
}

describe('trips API', () => {
  beforeEach(() => {
    vi.resetModules()
    findAllTrips.mockReset()
    findTripById.mockReset()
    createTrip.mockReset()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('lists trips', async () => {
    findAllTrips.mockResolvedValue([
      { id: 1, destination: 'Amman, Jordan', hostName: 'Layla' },
    ])
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/trips')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

  it('rejects invalid trip id', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/trips/abc')
    expect(res.status).toBe(400)
  })

  it('returns 404 when trip missing', async () => {
    findTripById.mockResolvedValue(null)
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/trips/99')
    expect(res.status).toBe(404)
  })

  it('requires auth to create a trip', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/trips').send({
      destination: 'Barcelona, Spain',
      departureCity: 'Cairo',
      startDate: '2026-12-01',
      endDate: '2026-12-08',
      budget: 'Mid-range',
      travelStyle: 'Cultural',
      blurb: 'Tapas',
    })
    expect(res.status).toBe(401)
  })

  it('creates a trip when authenticated', async () => {
    createTrip.mockResolvedValue({
      id: 5,
      destination: 'Barcelona, Spain',
      hostName: 'Eman',
      hostUserId: 7,
    })
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader())
      .send({
        destination: 'Barcelona, Spain',
        departureCity: 'Cairo',
        startDate: '2026-12-01',
        endDate: '2026-12-08',
        budget: 'Mid-range',
        travelStyle: 'Cultural',
        blurb: 'Tapas and calm walks',
        itinerary: 'Gothic Quarter',
      })
    expect(res.status).toBe(201)
    expect(res.body.hostUserId).toBe(7)
    expect(createTrip).toHaveBeenCalledWith(
      expect.objectContaining({ hostName: 'Eman', hostUserId: 7 }),
    )
  })
})
