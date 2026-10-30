
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

function MyList() {
    const { user, token , logout } = useAuth()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  
useEffect(() => {
  if (!token) {
    setLoading(false)
    return
  }

  fetch(`${import.meta.env.VITE_API_URL}/api/my-list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
  if (response.status === 401) {
    logout()
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch My List')
  }

  return response.json()
})
.then((data) => {
  if (data) {
    setMovies(data)
  }
})
 
    .catch((error) => {
      console.error(error)
      setError('Failed to fetch My List. Please try again.')
    })
    .finally(() => {
      setLoading(false)
    })
}, [token,logout])
  return (
    <div className="login-page">
      <h1>My List</h1>
      {user && <p>Logged in as: {user.email}</p>}




      

{loading ? (
  <p>Loading My List...</p>
) : error ? (
  <p className="error-message">{error}</p>
) : movies.length === 0 ? (
  <p>Your list is empty. Add some movies!</p>
) : (
  <div className="movie-list">
    {movies.map((movie) => (
      <div className="movie-card" key={movie._id}>
        <img src={movie.poster} alt={movie.title} />

        <h3>{movie.title}</h3>
        <p>Genre: {movie.genre || 'Unknown'}</p>
        <p>Year: {movie.year || 'N/A'}</p>
        <p>
          Rating: {movie.rating ? `⭐ ${movie.rating}/10` : 'Not rated'}
        </p>

        <button
          onClick={async () => {
            try {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/my-list/${movie._id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )

              if (response.status === 401) {
                  logout()
                   return
                  }
              const data = await response.json()

              if (!response.ok) {
                throw new Error(
                  data.message || 'Failed to remove movie'
                )
              }

              setMovies((currentMovies) =>
                currentMovies.filter(
                  (item) => item._id !== movie._id
                )
              )

              alert('Movie removed from My List!')
            } catch (error) {
              alert(error.message)
            }
          }}
        >
          Remove from My List
        </button>
      </div>
    ))}
  </div>
)}

    </div>
  )
}

export default MyList
