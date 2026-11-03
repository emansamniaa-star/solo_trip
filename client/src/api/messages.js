import { authHeaders } from './session'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getConversations() {
  const response = await fetch(`${API_URL}/api/messages`, {
    headers: authHeaders(),
  })
  if (!response.ok) {
    throw new Error('Failed to fetch conversations')
  }
  return response.json()
}

export async function getConversationThread(id) {
  const response = await fetch(`${API_URL}/api/messages/${id}`, {
    headers: authHeaders(),
  })
  if (!response.ok) {
    throw new Error('Failed to fetch conversation')
  }
  return response.json()
}

export async function sendMessage(conversationId, text) {
  const response = await fetch(`${API_URL}/api/messages/${conversationId}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send message')
  }
  return data
}
