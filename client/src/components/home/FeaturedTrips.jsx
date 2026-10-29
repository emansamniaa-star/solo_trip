import { mockTrips } from '../../data/mockTrips'
import TripPreview from './TripPreview'

export default function FeaturedTrips() {
  const featured = mockTrips.slice(0, 3)

  return (
    <section
      id="featured-trips"
      aria-label="Featured trips"
      className="scroll-mt-24 bg-stone-50 px-5 py-16 sm:px-8 md:px-12 md:py-24"
    >
      <h2
        className="text-3xl font-semibold text-stone-900 md:text-4xl"
        style={{ fontFamily: 'Fraunces, serif' }}
      >
        Featured trips
      </h2>
      <p className="mt-3 max-w-2xl text-stone-600">
        Upcoming plans from women looking for a companion — same destination,
        overlapping dates.
      </p>

      <ul className="mt-10 grid list-none gap-10 p-0 md:mt-12 md:grid-cols-3 md:gap-8">
        {featured.map((trip) => (
          <TripPreview key={trip.id} trip={trip} />
        ))}
      </ul>
    </section>
  )
}
