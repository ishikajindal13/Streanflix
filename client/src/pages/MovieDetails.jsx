
import { useParams } from 'react-router-dom'

function MovieDetails() {
  const { id } = useParams()

  return (
    <div className="login-page">
      <h1>Movie Details</h1>
      <p>Selected movie ID: {id}</p>
    </div>
  )
}

export default MovieDetails
