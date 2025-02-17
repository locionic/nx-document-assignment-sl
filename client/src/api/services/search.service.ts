import { API_ENDPOINTS } from '../config';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
}

export const SearchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    const response = await fetch(`${API_ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`);
    return response.json();
  },
}; 