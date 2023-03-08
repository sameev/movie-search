import { useEffect, useReducer } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=78defae8&s=man';

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_MOVIES_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case 'SEARCH_MOVIES_SUCCESS':
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case 'SEARCH_MOVIES_FAILURE':
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchedData = async () => {
      const res = await fetch(OMDB_API_URL);
      const data = await res.json();
      dispatch({
        type: 'SEARCH_MOVIES_SUCCESS',
        payload: data.Search,
      });
    };

    fetchedData().catch(console.error);
  }, []);

  const search = async (searchValue) => {
    dispatch({
      type: 'SEARCH_MOVIES_REQUEST',
    });

    const res = await fetch(
      `http://www.omdbapi.com/?apikey=78defae8&s=${searchValue}`
    );
    const data = await res.json();

    if (data.Response === 'True') {
      dispatch({
        type: 'SEARCH_MOVIES_SUCCESS',
        payload: data.Search,
      });
    } else {
      dispatch({
        type: 'SEARCH_MOVIES_FAILURE',
        error: data.Error,
      });
    }
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className='App root'>
      <Header text='Movie Search' />
      <Search search={search} />
      <p className='App-intro'>See below for some movies!</p>
      <div className='movies'>
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className='errorMessage'>{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
