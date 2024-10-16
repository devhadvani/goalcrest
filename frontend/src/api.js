import axios from 'axios';
import  store  from './store'; // Adjust to your Redux store location

const API_URL = 'http://localhost:8000';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies (for the refresh token)
});

// Add interceptor to refresh token if the access token expires
api.interceptors.response.use(
  (response) => response,  // Pass successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't retried this request yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the refresh token
        const res = await api.post('/auth/jwt/refresh/', {}, { withCredentials: true });

        if (res.status === 200) {
          // Dispatch action to update the access token in Redux
          store.dispatch({
            type: 'auth/tokenReceived',
            payload: res.data.access,
          });

          // Update the original request's Authorization header with the new token
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Handle failed token refresh
        console.error('Failed to refresh token', refreshError);
      }
    }

    return Promise.reject(error);  // Pass errors down the line
  }
);

export default api;
