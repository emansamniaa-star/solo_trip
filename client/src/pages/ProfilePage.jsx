import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileInterests from '../components/profile/ProfileInterests'
import ProfileTrips from '../components/profile/ProfileTrips'
import Button from '../components/common/Button'
import { getTrips } from '../api/trips'
import { clearSession, getSavedUser } from '../api/session'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user] = useState(() => getSavedUser())
  const [myTrips, setMyTrips] = useState([])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadMyTrips() {
      try {
        const trips = await getTrips()
        if (!cancelled) {
          setMyTrips(
            trips.filter(
              (trip) =>
                trip.hostUserId === user.id ||
                trip.hostName?.toLowerCase() === user.firstName?.toLowerCase(),
            ),
          )
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadMyTrips()

    return () => {
      cancelled = true
    }
  }, [user])

  function handleLogout() {
    clearSession()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="px-5 py-12 sm:px-8 md:px-12">
        <h1
          className="text-3xl font-semibold text-stone-900"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          You’re not logged in
        </h1>
        <p className="mt-3 text-stone-600">
          Please{' '}
          <Link to="/login" className="font-semibold text-amber-900 hover:underline">
            log in
          </Link>{' '}
          or{' '}
          <Link
            to="/register"
            className="font-semibold text-amber-900 hover:underline"
          >
            create an account
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ProfileHeader user={user} />
        <Button type="button" variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
      <ProfileInterests interests={user.interests || []} />
      <ProfileTrips trips={myTrips} />
    </div>
  )
}
