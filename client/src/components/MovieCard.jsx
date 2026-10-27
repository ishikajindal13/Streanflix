import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function MovieCard({ id, title, poster, genre, year, rating, description }) {
    const navigate = useNavigate()
    const { token } = useAuth()
    return(
        <div className="movie-card"
         onClick={() => navigate(`/movie/${id}`)}
  style={{ cursor: 'pointer' }}>
            <img src={poster} alt={title} />
            <h3>{title}</h3>
                  <p>Genre: {genre || 'Unknown'}</p>
<p>Year: {year || 'N/A'}</p>
<p>Rating: {rating ? `⭐ ${rating}/10` : 'Not rated'}</p>
<p>{description || 'No description available.'}</p>

<button
  onClick={async (e) => {
    e.stopPropagation()

    if (!token) {
      alert('Please log in to add movies to My List')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/my-list/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add movie')
      }

      alert('Movie added to My List!')
    } catch (error) {
      alert(error.message)
    }
  }}
>
  + My List
</button>

        </div>
    )
}

export default MovieCard
