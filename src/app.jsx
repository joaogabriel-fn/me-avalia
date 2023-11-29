import { useState, useEffect } from 'react';

const getUrl = (type, searchParameter) =>
  type === 'id'
    ? `http://www.omdbapi.com/?apikey=362a4a6c&i=${searchParameter}`
    : `http://www.omdbapi.com/?apikey=362a4a6c&s=${searchParameter}`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSummary, setMovieSummary] = useState({});
  const [inputValue, setInputValue] = useState('Avatar');

  useEffect(() => {
    fetch(getUrl('search', inputValue))
      .then((r) => r.json())
      .then((data) => setMovies(data.Search));
  }, [inputValue]);

  useEffect(() => {
    if (selectedMovie) {
      fetch(getUrl('id', selectedMovie.imdbID))
        .then((r) => r.json())
        .then((data) => setMovieSummary(data))
        .catch((err) => console.log(err));
    }
    // fetch('../mock/fake-overview.json')
    //   .then((r) => r.json())
    //   .then((data) => setMovieSummary(data));
  }, [selectedMovie]);

  const handleSelectMovie = (movie) =>
    setSelectedMovie((prev) => (prev?.imdbID === movie.imdbID ? null : movie));

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setInputValue(e.target.movieName.value);
  };

  return (
    <>
      <nav className="nav-bar">
        <img className="logo" src="./img/logo-me-avalia.png" alt="" />
        <form onSubmit={handleSearchSubmit} className="form-search">
          <input
            name="movieName"
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
            <div className="summary">
              <h2>Filmes assistidos</h2>
              <div>
                <p>#️⃣ 0 filmes</p>
                <p>⏳ 0 min</p>
              </div>
            </div>
          )}

          {selectedMovie && (
            <div className="details">
              <header>
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
                  <select>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>

                  <button className="btn-add">+ Adicionar à lista</button>
                </div>

                <p>{movieSummary.Plot}</p>
                <p>Elenco: {movieSummary.Actors}</p>
                <p>Direção: {movieSummary.Director}</p>
              </section>
            </div>
          )}

          <ul className="list list-watched"></ul>
        </div>
      </main>
    </>
  );
};

export { App };
