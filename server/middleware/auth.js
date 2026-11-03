import { verifyToken } from '../utils/token.js'

/**
 * requireAuth
 * Looks for: Authorization: Bearer <token>
 * If valid, sets req.user = { id, email, firstName }
 * If missing/invalid → 401
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
    }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
