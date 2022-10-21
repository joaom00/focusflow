import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.response.use(
  (response) => response
  ,
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.setState({ user: null, token: '', authenticated: false })
    }
    return Promise.reject(error)
  }
)
