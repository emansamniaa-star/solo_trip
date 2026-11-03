import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

vi.mock('../config/db.js', () => ({
  sql: vi.fn(async () => [{ connected: 1 }]),
}))

describe('health API', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('GET /api/health returns ok', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('GET /api/db-health returns connected', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/db-health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.db.connected).toBe(1)
  })

  it('unknown route returns 404', async () => {
    const { default: app } = await import('../app.js')
    const res = await request(app).get('/api/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.error).toMatch(/not found/i)
  })
})
