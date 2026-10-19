
import { useAuth } from '../context/AuthContext'

function MyList() {
  const { user } = useAuth()

  return (
    <div className="login-page">
      <h1>My List</h1>

      {user && <p>Logged in as: {user.email}</p>}

      <p>Your saved movies will appear here.</p>
    </div>
  )
}

export default MyList
