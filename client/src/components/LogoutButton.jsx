import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LogoutButton() {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  setToken(null)
  setUser(null)

  navigate('/login')
}

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton