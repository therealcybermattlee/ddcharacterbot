import axios from 'axios'

const API_BASE_URL = 'https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token on 401 Unauthorized
      localStorage.removeItem('authToken')
      // Redirect to home page instead of non-existent /login route
      // The Layout component will show the login button for unauthenticated users
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)