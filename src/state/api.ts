import axios, { AxiosInstance } from 'axios';

const engineBaseURL = import.meta.env.VITE_ENGINE_URL;

if (!engineBaseURL) {
  throw new Error('VITE_ENGINE_URL environment variable is not defined.');
}

const api: AxiosInstance = axios.create({
  baseURL: engineBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;