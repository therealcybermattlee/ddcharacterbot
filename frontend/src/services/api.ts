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
  async (error) => {
    if (error.response?.status === 401) {
      // Check if this is a public reference data endpoint
      const publicEndpoints = ['/races', '/classes', '/backgrounds', '/spells']
      const isPublicEndpoint = publicEndpoints.some(endpoint =>
        error.config?.url?.includes(endpoint)
      )

      // For public endpoints, retry without auth token
      if (isPublicEndpoint && error.config && !error.config.__isRetry) {
        error.config.__isRetry = true
        delete error.config.headers.Authorization
        return api.request(error.config)
      }

      // Clear auth token on 401 Unauthorized
      localStorage.removeItem('authToken')

      // Only redirect to home if not accessing public endpoints
      if (!isPublicEndpoint && window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)