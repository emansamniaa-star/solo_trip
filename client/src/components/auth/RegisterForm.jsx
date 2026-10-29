import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../common/Input'
import TextArea from '../common/TextArea'
import Button from '../common/Button'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    city: '',
    email: '',
    password: '',
    bio: '',
    travelStyle: 'Cultural',
  })

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/profile')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-lg space-y-5">
      <Input
        id="reg-first-name"
        label="First name"
        value={form.firstName}
        onChange={updateField('firstName')}
        required
        autoComplete="given-name"
      />
      <Input
        id="reg-city"
        label="City / region"
        value={form.city}
        onChange={updateField('city')}
        required
      />
      <Input
        id="reg-email"
        label="Email"
        type="email"
        value={form.email}
        onChange={updateField('email')}
        required
        autoComplete="email"
      />
      <Input
        id="reg-password"
        label="Password"
        type="password"
        value={form.password}
        onChange={updateField('password')}
        required
        autoComplete="new-password"
      />
      <label className="block">
        <span className="text-sm font-semibold text-stone-800">Travel style</span>
        <select
          value={form.travelStyle}
          onChange={updateField('travelStyle')}
          className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-amber-700"
        >
          <option>Cultural</option>
          <option>Budget</option>
          <option>Backpacking</option>
          <option>Luxury</option>
          <option>City break</option>
          <option>Nature & culture</option>
        </select>
      </label>
      <TextArea
        id="reg-bio"
        label="Short introduction"
        value={form.bio}
        onChange={updateField('bio')}
        placeholder="Tell companions a little about how you like to travel…"
        rows={4}
      />
      <Button type="submit">Create account</Button>
      <p className="text-sm text-stone-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-amber-900 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
