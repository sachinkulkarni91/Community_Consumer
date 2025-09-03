import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

const baseUrl = getApiUrl('/auth/login/temp')
const signupUrl = getApiUrl('/auth/signup')
const inviteSignupUrl = getApiUrl('/auth/signup/invite')

export const signup = async (username : string, password : string, name : string, email : string,) => {
  const user =  await axios.post(baseUrl, { email, password, username, name})
  return user.data
}

// New invite-based signup
export const signupWithInvite = async (password: string) => {
  const response = await axios.post(inviteSignupUrl, { 
    password
  }, {
    withCredentials: true
  });
  return response.data;
}

// Regular signup (for non-invite users)
export const regularSignup = async (username: string, password: string, name: string, email: string) => {
  const response = await axios.post(signupUrl, { 
    username, 
    password, 
    name, 
    email 
  }, {
    withCredentials: true
  });
  return response.data;
}
