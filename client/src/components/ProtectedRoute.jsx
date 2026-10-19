import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    async function verifyToken() {

      if (!token) {
        setIsAuthenticated(false)
        return
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Token verification failed:', error)
        setIsAuthenticated(false)
      }
    }

    verifyToken()
  }, [token])

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute