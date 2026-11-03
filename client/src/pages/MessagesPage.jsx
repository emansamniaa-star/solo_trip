import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import ConversationList from '../components/messaging/ConversationList'
import { getConversations } from '../api/messages'
import { getToken } from '../api/session'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
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
        const data = await getConversations()
        if (!cancelled) setConversations(data)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Could not load messages. Please log in again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [loggedIn])

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <PageHeader
        title="Messages"
        subtitle="Private conversations with potential travel companions."
      />

      {!loggedIn && (
        <p className="mt-10 text-stone-600">
          Please{' '}
          <Link to="/login" className="font-semibold text-amber-900 hover:underline">
            log in
          </Link>{' '}
          to view your messages.
        </p>
      )}

      {loggedIn && loading && (
        <p className="mt-10 text-stone-600">Loading conversations…</p>
      )}
      {loggedIn && error && <p className="mt-10 text-red-700">{error}</p>}
      {loggedIn && !loading && !error && (
        conversations.length === 0 ? (
          <p className="mt-10 text-stone-600">
            No conversations yet. Start one after you connect on a trip.
          </p>
        ) : (
          <ConversationList conversations={conversations} />
        )
      )}
    </div>
  )
}
