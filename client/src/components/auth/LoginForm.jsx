import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../common/Input'
import Button from '../common/Button'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    // UI-only for now — real auth comes with the backend sprint
    navigate('/profile')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-5">
      <Input
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button type="submit" className="w-full sm:w-auto">
        Log in
      </Button>
      <p className="text-sm text-stone-600">
        New here?{' '}
        <Link to="/register" className="font-semibold text-amber-900 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
