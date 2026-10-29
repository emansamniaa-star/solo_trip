import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import SearchFilters from '../components/search/SearchFilters'
import SearchResults from '../components/search/SearchResults'
import { mockTrips } from '../data/mockTrips'
import { tripsOverlap } from '../utils/dateOverlap'

export default function SearchPage() {
  const [filters, setFilters] = useState({
    destination: '',
    startDate: '',
    endDate: '',
  })

  const trips = useMemo(() => {
    const destination = filters.destination.trim().toLowerCase()

    return mockTrips.filter((trip) => {
      const matchesDestination =
        !destination || trip.destination.toLowerCase().includes(destination)
      const matchesDates = tripsOverlap(trip, filters.startDate, filters.endDate)
      return matchesDestination && matchesDates
    })
  }, [filters])

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <PageHeader
        title="Search & matching"
        subtitle="Filter by destination and your travel window. We’ll highlight overlapping days."
      />
      <SearchFilters filters={filters} onChange={setFilters} />
      <SearchResults trips={trips} filters={filters} />
    </div>
  )
}
