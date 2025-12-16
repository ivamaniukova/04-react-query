import { useState, useEffect } from 'react';
import css from './App.module.css';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import toast from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import ReactPaginate from 'react-paginate';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery.trim() !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) return;

    if (data.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [data]);

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      toast('Please, enter the keyword for this search');
      return;
    }
    setSearchQuery(trimmedQuery);
    setCurrentPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}
