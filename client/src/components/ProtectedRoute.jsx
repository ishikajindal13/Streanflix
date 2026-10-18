import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem('token')

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
  }, [])

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute