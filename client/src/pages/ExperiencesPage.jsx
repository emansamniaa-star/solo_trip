import { useEffect, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import ExperienceCard from '../components/experiences/ExperienceCard'
import { getExperiences } from '../api/experiences'

export default function ExperiencesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getExperiences()
        if (!cancelled) setStories(data)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Could not load experiences from the server.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="px-5 py-12 sm:px-8 md:px-12">
      <PageHeader
        title="Experiences & recommendations"
        subtitle="Safety tips, budget ideas, and local advice from the community."
      />

      {loading && <p className="mt-10 text-stone-600">Loading experiences…</p>}
      {error && <p className="mt-10 text-red-700">{error}</p>}

      {!loading && !error && (
        <ul className="mt-10 list-none space-y-2 p-0">
          {stories.map((story) => (
            <ExperienceCard key={story.id} story={story} />
          ))}
        </ul>
      )}
    </div>
  )
}
