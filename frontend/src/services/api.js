import axios from 'axios'

// Uses Vite proxy (/api → http://localhost:5001) during dev.
// If proxy fails, falls back to direct URL.
const api = axios.create({ baseURL: '/api' })

api.interceptors.response.use(
  res => res,
  async err => {
    // If proxy failed (network error), retry directly against port 5001
    if (!err.response && err.config && !err.config.__retried) {
      err.config.__retried = true
      err.config.baseURL = 'http://localhost:5001/api'
      err.config.url = 'http://localhost:5001' + '/api' + err.config.url
      return axios(err.config)
    }
    return Promise.reject(err)
  }
)

export const fetchMetrics = () => api.get('/metrics').then(r => r.data)

export const predictPrice = (features) => api.post('/predict', features).then(r => r.data)
