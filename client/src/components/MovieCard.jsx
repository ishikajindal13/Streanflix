function MovieCard({title,poster}){
    return(
        <div className="movie-card">
            <img src={poster} alt={title} />
            <h3>{title}</h3>
                  {/* <p>Genre: {movie.genre || 'Unknown'}</p>
      <p>Year: {movie.year || 'N/A'}</p> */}
        </div>
    )
}

export default MovieCard
