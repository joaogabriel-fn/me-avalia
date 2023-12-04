import { useState, useEffect } from 'react';

const getUrl = (type, searchParameter) =>
  type === 'id'
    ? `http://www.omdbapi.com/?apikey=362a4a6c&i=${searchParameter}`
    : `http://www.omdbapi.com/?apikey=362a4a6c&s=${searchParameter}`;

const getTotalMinutes = (ratedMovies) =>
  ratedMovies.reduce((acc, item) => acc + +item.Runtime.split(' ')[0], 0);

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [movies, setMovies] = useState([]);
  const [movieSummary, setMovieSummary] = useState({});

  const [ratedMovies, setRatedMovies] = useState([]);
  // Estado timeWatched pode ser substituido por uma função que extrai o tempo assistindo quando o <p> for renderizado
  // const [timeWatched, setTimeWatched] = useState(0);
  // Estado personalRating pode ser substituido inserindo um form no select de rating, onde executa uma função onsubmit q grava o rating direto no objeto ratedMovies
  // const [personalRating, setPersonalRating] = useState(0);

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

  // const handleSubmitRating = (personalRating, movie) => {
  //   const watchTime = movie.Runtime.split(' ')[0];
  //   const newMovie = { ...movie, personalRating };
  //   setRatedMovies((prev) => [...prev, newMovie]);
  //   setTimeWatched((prev) => prev + +watchTime);
  //   setSelectedMovie(null);
  // };
  const handleSubmitRating = (e) => {
    e.preventDefault();

    const { rating } = e.target.elements;
    const newMovie = { ...movieSummary, personalRating: rating.value };
    setRatedMovies((prev) => [...prev, newMovie]);
    setSelectedMovie(null);
  };

  const handleDeleteClick = (movie) => {
    // const watchTime = movie.Runtime.split(' ')[0];
    // setTimeWatched((prev) => prev - +watchTime);
    setRatedMovies((prev) =>
      prev.filter((ratedMovie) => ratedMovie.imdbID !== movie.imdbID),
    );
  };

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
        <p className="num-result">
          <strong>{movies?.length} Resultados</strong>
        </p>
      </nav>

      <main className="main">
        <div className="box">
          <button className="btn-toggle">-</button>
          <ul className="list list-movies">
            {movies?.map((movie) => (
              <li key={movie.imdbID} onClick={() => handleSelectMovie(movie)}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <div>
                  <p>
                    <span>📅</span>
                    <span>{movie.Year}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <button className="btn-toggle">-</button>

          {selectedMovie ? (
            <div className="details">
              <header>
                <button
                  className="btn-back"
                  onClick={() => setSelectedMovie(null)}
                >
                  &larr;
                </button>
                <img
                  src={movieSummary.Poster}
                  alt={`Poster de ${movieSummary.Title}`}
                />
                <div className="details-overview">
                  <h2>{movieSummary.title}</h2>
                  <p>
                    {movieSummary.Released} &bull; {movieSummary.Runtime}
                  </p>
                  <p>{movieSummary.Genre}</p>
                  <p>
                    <span>⭐</span>
                    {movieSummary.imdbRating} IMDB rating
                  </p>
                </div>
              </header>
              <section>
                <div className="rating">
                  <form onSubmit={handleSubmitRating} className="form-rating">
                    <p>Qual nota você dá para este filme?</p>
                    <div>
                      <select name="rating" defaultValue={1}>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <button className="btn-add">+ Adicionar à lista</button>
                    </div>
                  </form>
                  <p>{movieSummary.Plot}</p>
                  <p>Elenco: {movieSummary.Actors}</p>
                  <p>Direção: {movieSummary.Director}</p>
                </div>
              </section>
            </div>
          ) : (
            <>
              <div className="summary">
                <h2>Histórico</h2>
                <div>
                  <p>
                    <span>#️⃣</span> <span>{ratedMovies.length} Filmes</span>
                  </p>
                  <p>
                    <span>⏳</span>{' '}
                    <span>{getTotalMinutes(ratedMovies)} min</span>
                  </p>
                </div>
              </div>
              <ul className="list">
                {ratedMovies.map((m) => (
                  <li key={m.imdbID}>
                    <img src={m.Poster} alt={`Poster de ${m.Title}`} />
                    <h3>{m.Title}</h3>
                    <div>
                      <p>
                        <span>⭐</span>
                        <span>{m.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{m.personalRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{m.Runtime}</span>
                      </p>
                      <button
                        onClick={() => handleDeleteClick(m)}
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

          {/* {!selectedMovie && (
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
                      <p>⭐ {movie.imdbRating}</p>
                      <p>🌟 {movie.personalRating}</p>
                      <p>⏳ {movie.Runtime}</p>
                      <button
                        onClick={() => handleDeleteClick(movie)}
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
                  &larr;
                </button>
                <img src={selectedMovie.Poster} alt="" />
                <div className="details-overview">
                  <h2>{selectedMovie.Title}</h2>
                  <p>
                    {movieSummary.Released} &bull; {movieSummary.Runtime}
                  </p>
                  <p>{movieSummary.Genre}</p>
                  <p>
                    <span>⭐</span>
                    {movieSummary.imdbRating} imdbRating
                  </p>
                </div>
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
          )} */}
        </div>
      </main>
    </>
  );
};

export { App };
