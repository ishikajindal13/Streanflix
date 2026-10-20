function MovieCard({ title, poster, genre, year, rating, description }) {
    return(
        <div className="movie-card">
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
