import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL
console.log('API URL =', BASE_URL)

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
 const user = localStorage.getItem('user')
if (user) {
  const parsed = JSON.parse(user)
  if (parsed.token) {
    config.headers.Authorization = `Bearer ${parsed.token}`
  }
 else {
      console.warn('Usuario en localStorage pero sin token:', parsed)
    }
  }
  return config
})

// Interceptor de respuesta para ver errores en detalle
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'API ERROR →',
      error.config?.method?.toUpperCase(),
      error.config?.url,
      '|', error.response?.status,
      '|', error.response?.data
    )
    return Promise.reject(error)
  }
)

export default api