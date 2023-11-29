import { useState, useEffect } from 'react';

const App = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('../mock/fake-data.json')
      .then((r) => r.json())
      .then((data) => setMovies(data.Search));
  }, []);

  return (
    <>
      <nav className="nav-bar">
        <img className="logo" src="./img/logo-me-avalia.png" alt="" />
        <form className="form-search">
          <input
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
            {movies.map((movie) => (
              <li key={movie.imdbID}>
                <h3>{movie.Title}</h3>
                <img src={movie.Poster} alt="" />
                <div>
                  <p>📅 2001</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="box">
          <button className="btn-toggle">-</button>
          <div className="summary">
            <h2>Filmes assistidos</h2>
            <div>
              <p>#️⃣ 0 filmes</p>
              <p>⏳ 0 min</p>
            </div>
          </div>
          <ul className="list list-watched"></ul>
        </div>
      </main>
    </>
  );
};

export { App };
