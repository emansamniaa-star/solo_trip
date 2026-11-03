import 'dotenv/config'
import { sql } from './config/db.js'

async function seed() {
  await sql`DELETE FROM trips`

  const tripRows = [
    [
      'Amman, Jordan',
      'Cairo',
      '2026-11-10',
      '2026-11-18',
      'Mid-range',
      'Cultural',
      'Layla',
      'Old souks, museums, and a day trip to Petra — looking for a calm companion.',
      'Days in Amman for cafés and museums, one full day in Petra, optional Dead Sea evening.',
    ],
    [
      'Marrakech, Morocco',
      'Dubai',
      '2026-12-02',
      '2026-12-09',
      'Budget',
      'Backpacking',
      'Nour',
      'Riads, street food, and Atlas foothills. Happy to share some days or the full week.',
      'Medina walks, a cooking class, and a day trip toward the Atlas if energy allows.',
    ],
    [
      'Istanbul, Turkey',
      'Riyadh',
      '2027-01-15',
      '2027-01-22',
      'Comfort',
      'City break',
      'Sara',
      'Mosques, ferries, and café mornings. Prefer overlapping a few days if not the whole trip.',
      'Historic peninsula, Kadıköy ferry mornings, and one Bosphorus sunset walk.',
    ],
    [
      'Helsinki, Finland',
      'Kuwait City',
      '2026-11-20',
      '2026-11-27',
      'Comfort',
      'Nature & culture',
      'Huda',
      'Quiet lakes, design cafés, and a sauna evening — looking for a calm winter companion.',
      'City walks in Helsinki, one museum day, optional day trip toward the archipelago.',
    ],
  ]

  for (const t of tripRows) {
    await sql`
      INSERT INTO trips (
        destination, departure_city, start_date, end_date,
        budget, travel_style, host_name, blurb, itinerary
      ) VALUES (
        ${t[0]}, ${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${t[5]}, ${t[6]}, ${t[7]}, ${t[8]}
      )
    `
  }

  await sql`DELETE FROM experiences`

  const stories = [
    [
      'Feeling safe in Amman’s downtown evenings',
      'Layla',
      'Amman, Jordan',
      'Stick to well-lit streets near Rainbow Street, share your live location with a friend, and ask locals which taxis they trust.',
      'Safety',
      'I arrived after sunset and felt nervous at first. Staying on busy, lit streets and messaging a friend my location every hour made a big difference.',
    ],
    [
      'Budget mornings in Marrakech',
      'Nour',
      'Marrakech, Morocco',
      'Skip hotel breakfast once — fresh juice and msemen from a neighborhood stall costs little and starts conversations.',
      'Budget',
      'One morning outside the tourist belt taught me more than any guidebook. A small stall, a smile, and patience with language went further than rushing.',
    ],
    [
      'A quiet ferry hour in Istanbul',
      'Sara',
      'Istanbul, Turkey',
      'Take the morning ferry to Kadıköy before the rush. Pack a scarf, sit outdoors, and watch the city wake up slowly.',
      'Tips',
      'The early ferry is my reset button on city trips. Less noise, softer light, and time to decide the day without pressure.',
    ],
    [
      'Dress and respect in Muscat markets',
      'Huda',
      'Muscat, Oman',
      'Modest clothing kept me comfortable in souqs and mosques. Packing a light scarf saved space and stress.',
      'Etiquette',
      'I felt more at ease when my clothes matched the local tone. It was about respect and blending in so I could enjoy conversations longer.',
    ],
  ]

  for (const s of stories) {
    await sql`
      INSERT INTO experiences (title, author_name, place, excerpt, tag, body)
      VALUES (${s[0]}, ${s[1]}, ${s[2]}, ${s[3]}, ${s[4]}, ${s[5]})
    `
  }

  const trips = await sql`SELECT id, destination FROM trips ORDER BY id`
  const experiences = await sql`SELECT id, title FROM experiences ORDER BY id`
  console.log('✅ seeded trips:')
  console.table(trips)
  console.log('✅ seeded experiences:')
  console.table(experiences)
}

seed().catch((error) => {
  console.error('❌ seed failed:', error)
  process.exit(1)
})
