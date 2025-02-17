const API_BASE_URL = 'http://localhost:4000/api';

export const API_ENDPOINTS = {
  FOLDERS: `${API_BASE_URL}/folders`,
  DOCUMENTS: `${API_BASE_URL}/documents`,
  SEARCH: `${API_BASE_URL}/search`,
  HISTORY: `${API_BASE_URL}/history`,
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}; 