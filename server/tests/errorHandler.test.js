import { describe, expect, it } from 'vitest'
import { errorHandler } from '../middleware/errorHandler.js'

describe('errorHandler middleware', () => {
  it('sends JSON error payload', () => {
    const err = new Error('boom')
    err.status = 503
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code
        return this
      },
      json(payload) {
        this.body = payload
        return this
      },
    }

    errorHandler(err, {}, res, () => {})
    expect(res.statusCode).toBe(503)
    expect(res.body.error).toBe('boom')
  })
})
