import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

  const handleLogin = async (event) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

localStorage.setItem('token', data.token)
localStorage.setItem('user', JSON.stringify(data.user))

const verifyResponse = await fetch(
  'http://localhost:5000/api/auth/me',
  {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  }
)

if (!verifyResponse.ok) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  throw new Error('Authentication verification failed')
}

await verifyResponse.json()

setToken(data.token)
setUser(data.user)

navigate('/')
    } catch (error) {
      setMessage(error.message || 'Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1>Sign In to StreamFlix</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )
}

export default Login
