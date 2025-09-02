import axios from "axios"
import { getApiUrl } from '../utils/api-url'

const baseUrl = getApiUrl('/auth/forgot-password')

const forgotPassword = async (email: string) => {
  const response = await axios.post(baseUrl, { email })
  return response.data
}

const sendOTP = async (email: string, code: string) => {
  const response = await axios.post(`${baseUrl}/verify`, { email, code })
  return response.data
}

const resetPassword = async (email: string, password: string) => {
  const response = await axios.post(`${baseUrl}/reset`, { email, password })
  return response.data
}

export default { forgotPassword, sendOTP, resetPassword }