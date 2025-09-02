import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

// Configure axios
axios.defaults.withCredentials = true;

const getBaseUrl = () => {
  // In development, use proxy. In production, use full backend URL
  if (import.meta.env.DEV) {
    return '/auth/login'
  }
  return `${import.meta.env.VITE_API_URL}/auth/login`
}

const baseUrl = getBaseUrl()

const login = async (username : string, password : string) => {
  const user = await axios.post(baseUrl, { username, password })
  return user.data
}

const logout = async () => {
  const logoutUrl = getApiUrl('/auth/logout')
  await axios.post(logoutUrl)
  return
}

export default {login, logout} 