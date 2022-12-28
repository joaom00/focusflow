import { useAuthStore } from '@/stores'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().actions.logout()
    }
    return Promise.reject(error)
  }
)
