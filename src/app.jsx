const App = () => (
  <>
    <nav className="nav-bar">
      <img className="logo" src="./img/logo-me-avalia.png" alt="" />
      <form className="form-search">
        <input className="search" placeholder="Buscar Filmes..." type="text" />
        <button className="btn-search">Buscar</button>
      </form>
      <h2 className="num-result">5 resultados</h2>
    </nav>

    <main className="main">
      <div className="box">
        <button className="btn-toggle">-</button>
        <ul className="list list-movies">
          <li>
            <h3>Matrix</h3>
            <img
              src="https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
              alt=""
            />
            <div>
              <p>📅 2001</p>
            </div>
          </li>
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

export { App };
