import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

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

describe('trips API', () => {
  beforeEach(() => {
    vi.resetModules()
    findAllTrips.mockReset()
    findTripById.mockReset()
    createTrip.mockReset()
  })

  it('lists trips', async () => {
    findAllTrips.mockResolvedValue([
      { id: 1, destination: 'Amman, Jordan', hostName: 'Layla' },
    ])
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/trips')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].destination).toContain('Amman')
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

  it('creates a trip', async () => {
    createTrip.mockResolvedValue({
      id: 5,
      destination: 'Barcelona, Spain',
      hostName: 'Eman',
    })
    const { default: app } = await import('../app.js')
    const res = await request(app)
      .post('/api/trips')
      .send({
        destination: 'Barcelona, Spain',
        departureCity: 'Cairo',
        startDate: '2026-12-01',
        endDate: '2026-12-08',
        budget: 'Mid-range',
        travelStyle: 'Cultural',
        hostName: 'Eman',
        blurb: 'Tapas and calm walks',
        itinerary: 'Gothic Quarter',
      })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe(5)
  })

  it('rejects incomplete create body', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).post('/api/trips').send({ destination: 'X' })
    expect(res.status).toBe(400)
  })
})
