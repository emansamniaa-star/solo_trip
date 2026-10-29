import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileInterests from '../components/profile/ProfileInterests'
import ProfileTrips from '../components/profile/ProfileTrips'
import { currentUser } from '../data/mockUsers'
import { mockTrips } from '../data/mockTrips'

export default function ProfilePage() {
  const myTrips = mockTrips.filter((trip) => trip.hostId === currentUser.id)

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <ProfileHeader user={currentUser} />
      <ProfileInterests interests={currentUser.interests} />
      <ProfileTrips trips={myTrips} />
    </div>
  )
}
