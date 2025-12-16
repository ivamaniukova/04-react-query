import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    accept: 'application/json',
  },
});

interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export async function fetchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_results: 0,
      total_pages: 0,
    };
  }
  const response = await api.get<TMDBSearchResponse>('/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
  });
  return response.data;
}
