import { useNavigate } from 'react-router-dom'

function MovieCard({ id, title, poster, genre, year, rating, description }) {
    const navigate = useNavigate()
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
        </div>
    )
}

export default MovieCard
