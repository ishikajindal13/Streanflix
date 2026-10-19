
import { createContext, useContext, useState , useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  )

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(true)

  
useEffect(() => {
  const checkAuth = async () => {
    if (!token) {
      setUser(null)
      setLoading(false)
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
        throw new Error('Session is invalid')
      }

      const data = await response.json()

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  checkAuth()
}, [token])


  
return (
  <AuthContext.Provider
    value={{ token, user, setToken, setUser, loading }}
  >
    {children}
  </AuthContext.Provider>
)

}

export function useAuth() {
  return useContext(AuthContext)
}
