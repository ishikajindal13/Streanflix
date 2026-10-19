import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LogoutButton() {
  const navigate = useNavigate()
  const { logout } = useAuth()

function handleLogout() {
  logout()
  navigate('/login')
}

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton