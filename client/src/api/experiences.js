import { authHeaders } from './session'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getExperiences() {
  const response = await fetch(`${API_URL}/api/experiences`)
  if (!response.ok) {
    throw new Error('Failed to fetch experiences')
  }
  return response.json()
}

export async function getExperienceById(id) {
  const response = await fetch(`${API_URL}/api/experiences/${id}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch experience')
  }
  return response.json()
}

export async function createExperience(payload) {
  const response = await fetch(`${API_URL}/api/experiences`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create experience')
  }
  return data
}
