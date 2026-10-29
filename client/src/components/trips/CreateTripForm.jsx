import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../common/Input'
import TextArea from '../common/TextArea'
import Button from '../common/Button'

export default function CreateTripForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    destination: '',
    departureCity: '',
    startDate: '',
    endDate: '',
    budget: 'Mid-range',
    travelStyle: 'Cultural',
    blurb: '',
    itinerary: '',
  })

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    // UI-only: pretend create succeeded and show trip #1 as demo
    navigate('/trips/1')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-5">
      <Input
        id="trip-destination"
        label="Destination (city, country)"
        value={form.destination}
        onChange={updateField('destination')}
        required
      />
      <Input
        id="trip-departure"
        label="Departure city"
        value={form.departureCity}
        onChange={updateField('departureCity')}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="trip-start"
          label="Departure date"
          type="date"
          value={form.startDate}
          onChange={updateField('startDate')}
          required
        />
        <Input
          id="trip-end"
          label="Return date"
          type="date"
          value={form.endDate}
          onChange={updateField('endDate')}
          required
        />
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-stone-800">Budget</span>
        <select
          value={form.budget}
          onChange={updateField('budget')}
          className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-amber-700"
        >
          <option>Budget</option>
          <option>Mid-range</option>
          <option>Comfort</option>
          <option>Luxury</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-stone-800">Travel style</span>
        <select
          value={form.travelStyle}
          onChange={updateField('travelStyle')}
          className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 outline-none focus:border-amber-700"
        >
          <option>Cultural</option>
          <option>Backpacking</option>
          <option>City break</option>
          <option>Nature & culture</option>
          <option>Luxury</option>
        </select>
      </label>
      <TextArea
        id="trip-blurb"
        label="Trip description"
        value={form.blurb}
        onChange={updateField('blurb')}
        required
        rows={4}
      />
      <TextArea
        id="trip-itinerary"
        label="Planned itinerary (optional)"
        value={form.itinerary}
        onChange={updateField('itinerary')}
        rows={4}
      />
      <Button type="submit">Publish trip</Button>
    </form>
  )
}
