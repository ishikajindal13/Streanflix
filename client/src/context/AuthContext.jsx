
import { createContext, useContext, useState , useEffect ,useCallback } from 'react'

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
  const logout = useCallback(() => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  setToken(null)
  setUser(null)
  setLoading(false)
}, [])

const login = useCallback((newToken, newUser) => {
  localStorage.setItem('token', newToken)
  localStorage.setItem('user', JSON.stringify(newUser))

  setToken(newToken)
  setUser(newUser)
}, [])

useEffect(() => {
  if (!token) return

  let timer

  try {
    const payloadPart = token.split('.')[1]

    const base64 = payloadPart
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const paddedBase64 =
      base64 + '='.repeat((4 - (base64.length % 4)) % 4)

    const payload = JSON.parse(atob(paddedBase64))

    if (!payload.exp) {
      throw new Error('Token has no expiration')
    }

    const expiresAt = payload.exp * 1000
    const timeUntilExpiry = expiresAt - Date.now()

    if (timeUntilExpiry <= 0) {
      logout()
      return
    }

    timer = setTimeout(() => {
      logout()
    }, timeUntilExpiry)
  } catch (error) {
    logout()
  }

  return () => {
    if (timer) {
      clearTimeout(timer)
    }
  }
}, [token, logout])
  
useEffect(() => {
  let cancelled = false
  const checkAuth = async () => {
      setLoading(true)
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
       if (cancelled) return
      if (!response.ok) {
        throw new Error('Session is invalid')
      }

      const data = await response.json()
      if (cancelled) return

      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
       logout()
    } finally {
      setLoading(false)
    }
  }

  checkAuth()
  return () => {
  cancelled = true
}
}, [token,logout])


  
return (
  <AuthContext.Provider
    value={{ token, user, loading,login, logout   }}
  >
    {children}
  </AuthContext.Provider>
)

}

export function useAuth() {
  return useContext(AuthContext)
}
