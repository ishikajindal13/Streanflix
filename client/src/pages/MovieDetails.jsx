
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function MovieDetails() {
  const [movie, setMovie] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
  const { id } = useParams()

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Movie not found')
      }
      return res.json()
    })
    .then((data) => {
      setMovie(data)
      setLoading(false)
    })
    .catch((err) => {
      setError(err.message)
      setLoading(false)
    })
}, [id])
if (loading) {
  return <p>Loading movie...</p>
}

if (error) {
  return <p>{error}</p>
}

return (
  <div className="movie-details-page">
    <img src={movie.poster} alt={movie.title} />

    <h1>{movie.title}</h1>
    <p>Genre: {movie.genre || 'Unknown'}</p>
    <p>Year: {movie.year || 'N/A'}</p>
    <p>Rating: {movie.rating ? `⭐ ${movie.rating}/10` : 'Not rated'}</p>
    <p>{movie.description || 'No description available.'}</p>
  </div>
)
}

export default MovieDetails
