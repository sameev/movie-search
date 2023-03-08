import { useEffect, useState } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const OMDB_API_URL = 'http://www.omdbapi.com/?i=man&apikey=78defae8';



function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchedData = async () => {
      const res = await fetch(OMDB_API_URL);
      const {data} = await res.json();
      setMovies(data.Search);
      setLoading(false);
    };

    fetchedData().catch(console.error);
  }, []);

  const search = async (searchValue) => {
    setLoading(true);
    setErrorMessage(null);

    const res = await fetch(
      `http://www.omdbapi.com/?s=${searchValue}&apikey=78defae8`
    );
    const data = await res.json();

    if (data.Response === 'True') {
      setMovies(data.Search);
      setLoading(false);
    } else {
      setErrorMessage(data.Error);
      setLoading(false);
    }
  };

  return (
    <div className="App root">
      <Header text="Movie Search" />
      <Search search={search} />
      <p className="App-intro">See below for some movies!</p>
      <div className="movies">
        {loading && !errorMessage ? (
         <span>loading...</span>
         ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  )
}

export default App;
