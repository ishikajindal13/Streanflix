import { useEffect,useState } from 'react'
import '../App.css'
import MovieCard from '../components/MovieCard'



function App() {

  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
  fetch('http://localhost:5000/api/movies')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Could not load movies')
      }
      return response.json()
    })
    .then((data) => setMovies(data))
    .catch(() => {
      setError('Could not load movies. Is the backend running?')
    })
}, [])

  const filteredMovies = movies.filter((movie) =>
  movie.title.toLowerCase().includes(search.toLowerCase())
)

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">STREAMFLIX</h1>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Movies</a>
          <a href="#">My List</a>
        </div>

        <button className="login-btn">Sign In</button>
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
{error && <p>{error}</p>}
      <section className="movies-section">
        <h2>Popular on StreamFlix</h2>

        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} title={movie.title} poster={movie.poster} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
