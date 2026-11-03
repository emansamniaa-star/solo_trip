import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MessageThread from '../components/messaging/MessageThread'
import MessageComposer from '../components/messaging/MessageComposer'
import { getConversationThread, sendMessage } from '../api/messages'
import { getToken } from '../api/session'

export default function MessageThreadPage() {
  const { conversationId } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loggedIn = Boolean(getToken())

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false)
      return undefined
    }

    let cancelled = false

    async function load() {
      try {
        const data = await getConversationThread(conversationId)
        if (!cancelled) {
          setConversation(data.conversation)
          setMessages(data.messages)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Could not load this conversation.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [conversationId, loggedIn])

  async function handleSend(text) {
    const created = await sendMessage(conversationId, text)
    setMessages((prev) => [...prev, created])
  }

  if (!loggedIn) {
    return (
      <div className="px-5 py-12 sm:px-8 md:px-12">
        <p className="text-stone-600">
          Please{' '}
          <Link to="/login" className="font-semibold text-amber-900">
            log in
          </Link>{' '}
          to chat.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-5 py-12 sm:px-8 md:px-12">
        <p className="text-stone-600">Loading chat…</p>
      </div>
    )
  }

  if (error || !conversation) {
    return (
      <div className="px-5 py-12 sm:px-8 md:px-12">
        <h1
          className="text-3xl font-semibold text-stone-900"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Conversation not found
        </h1>
        <Link to="/messages" className="mt-6 inline-block font-semibold text-amber-900">
          ← Back to messages
        </Link>
      </div>
    )
  }

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <Link
        to="/messages"
        className="text-sm font-semibold text-stone-600 hover:text-stone-900"
      >
        ← All messages
      </Link>
      <h1
        className="mt-8 text-3xl font-semibold text-stone-900"
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        Chat with {conversation.withUser}
      </h1>
      <p className="mt-2 text-stone-500">{conversation.tripLabel}</p>
      <MessageThread messages={messages} />
      <MessageComposer onSend={handleSend} />
    </div>
  )
}
