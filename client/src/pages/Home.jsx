import { useEffect,useState } from 'react'
import '../App.css'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../context/AuthContext'
import.meta.env.VITE_API_URL

function App() {

  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/movies?page=${currentPage}&limit=5`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Could not load movies')
      }
      return response.json()
    })
    .then((data) => {
  setMovies(data.movies)
  setCurrentPage(data.currentPage)
  setTotalPages(data.totalPages)
})
    .catch(() => {
      setError('Could not load movies. Is the backend running?')
    })
    .finally(() => {
  setLoading(false)
})
}, [currentPage])

  const filteredMovies = movies.filter((movie) =>
  movie.title.toLowerCase().includes(search.toLowerCase())
)

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">STREAMFLIX</h1>

<div className="nav-links">
  <Link to="/">Home</Link>
  <Link to="/">Movies</Link>
  <Link to="/my-list">My List</Link>
</div>

{token ? (
  <LogoutButton />
) : (
  <Link to="/login" className="login-btn">
    Sign In
  </Link>
)}
      </nav>

      <main className="hero">
        <p className="tagline">YOUR NEXT FAVORITE AND INTERESTING STORY</p>

        <h2>Unlimited stories.<br />Endless entertainment.</h2>

        <p className="description">
          Discover movies, explore new worlds, and find
          your next favorite story.
        </p>

        <div className="hero-buttons">
          <button className="play-btn">▶ Explore Movies</button>
          <button className="info-btn">More Info</button>
        </div>
      </main>
      
<div className="search-container">
  <input
    type="text"
    placeholder="Search movies..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />
</div>
{loading && <p>Loading movies...</p>}
{error && <p>{error}</p>}
      <section className="movies-section">
        <h2>Popular on StreamFlix</h2>

        <div className="movie-list"
        onClick={() => navigate(`/movie/${id}`)}>
          {filteredMovies.length > 0 ? (
  filteredMovies.map((movie) => (
<MovieCard
  key={movie._id}
  id={movie._id}
  title={movie.title}
  poster={movie.poster}
  genre={movie.genre}
  year={movie.year}
  rating={movie.rating}
  description={movie.description}
/>
  ))
) : (
  !loading && !error && <p>No movies found.</p>
)}
        </div>
      </section>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default App
