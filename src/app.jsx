import { useState, useEffect } from 'react';

const getUrl = (type, searchParameter) =>
  type === 'id'
    ? `http://www.omdbapi.com/?apikey=362a4a6c&i=${searchParameter}`
    : `http://www.omdbapi.com/?apikey=362a4a6c&s=${searchParameter}`;

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [movies, setMovies] = useState([]);
  const [movieSummary, setMovieSummary] = useState({});

  const [ratedMovies, setRatedMovies] = useState([]);
  const [timeWatched, setTimeWatched] = useState(0);
  const [personalRating, setPersonalRating] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const [movieToSearch, setMovieToSearch] = useState('Avatar');

  useEffect(() => {
    fetch(getUrl('search', movieToSearch))
      .then((r) => r.json())
      .then((data) => setMovies(data.Search));
    // fetch('../mock/fake-data.json')
    //   .then((r) => r.json())
    //   .then((data) => setMovies(data.Search));
  }, [movieToSearch]);

  useEffect(() => {
    if (selectedMovie) {
      fetch(getUrl('id', selectedMovie.imdbID))
        .then((r) => r.json())
        .then((data) => setMovieSummary(data))
        .catch((err) => console.log(err));
      // fetch('../mock/fake-overview.json')
      //   .then((r) => r.json())
      //   .then((data) => setMovieSummary(data))
      //   .catch((err) => console.log(err));
    }
  }, [selectedMovie]);

  const handleSelectMovie = (movie) =>
    setSelectedMovie((prev) => (prev?.imdbID === movie.imdbID ? null : movie));

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setMovieToSearch(inputValue);
    setInputValue('');
  };

  const handleSubmitRating = (personalRating, movie) => {
    const watchTime = movie.Runtime.split(' ')[0];
    const newMovie = { ...movie, personalRating };
    setRatedMovies((prev) => [...prev, newMovie]);
    setTimeWatched((prev) => prev + +watchTime);
    setSelectedMovie(null);
  };

  const handleDeleteClick = (id) =>
    setRatedMovies((prev) => prev.filter((movie) => movie.imdbID !== id));

  return (
    <>
      <nav className="nav-bar">
        <img className="logo" src="./img/logo-me-avalia.png" alt="" />
        <form onSubmit={handleSearchSubmit} className="form-search">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="search"
            placeholder="Buscar Filmes..."
            type="text"
          />
          <button className="btn-search">Buscar</button>
        </form>
        <h2 className="num-result">5 resultados</h2>
      </nav>

      <main className="main">
        <div className="box">
          <button className="btn-toggle">-</button>
          <ul className="list list-movies">
            {movies?.map((movie) => (
              <li key={movie.imdbID} onClick={() => handleSelectMovie(movie)}>
                <h3>{movie.Title}</h3>
                <img src={movie.Poster} alt="" />
                <div>
                  <p>📅 {movie.Year}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <button className="btn-toggle">-</button>

          {!selectedMovie && (
            <>
              <div className="summary">
                <h2>Filmes assistidos</h2>
                <div>
                  <p>#️⃣ {ratedMovies.length} filmes</p>
                  <p>⏳ {timeWatched} min</p>
                </div>
              </div>
              <ul className="list list-watched">
                {ratedMovies?.map((movie) => (
                  <li key={movie.imdbID}>
                    <h3>{movie.Title}</h3>
                    <img src={movie.Poster} alt="" />
                    <div>
                      <p>⭐ {movie.Year}</p>
                      <p>🌟 {movie.personalRating}</p>
                      <p>⏳ {movie.Runtime}</p>
                      <button
                        onClick={() => handleDeleteClick(movie.imdbID)}
                        className="btn-delete"
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {selectedMovie && (
            <div className="details">
              <header>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="btn-back"
                >
                  ←
                </button>
                <img src={selectedMovie.Poster} alt="" />
                <section className="details-overview">
                  <h2>{selectedMovie.Title}</h2>
                  <p>
                    {movieSummary.Released} ◦ {movieSummary.Runtime}
                  </p>
                  <p>{movieSummary.Genre}</p>
                  <p>⭐ {movieSummary.imdbRating} imdbRating</p>
                </section>
              </header>

              <section>
                <div className="rating">
                  <select onChange={(e) => setPersonalRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>

                  <button
                    onClick={() =>
                      handleSubmitRating(personalRating, movieSummary)
                    }
                    className="btn-add"
                  >
                    + Adicionar à lista
                  </button>
                </div>

                <p>{movieSummary.Plot}</p>
                <p>Elenco: {movieSummary.Actors}</p>
                <p>Direção: {movieSummary.Director}</p>
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export { App };
