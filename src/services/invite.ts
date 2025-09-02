import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

// Get invite information from stored invite token
export const getInviteInfo = async () => {
  try {
    const response = await axios.get(getApiUrl('/api/invites/info'), {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Validate if an email was invited for the current invite
export const validateInviteEmail = async (email: string) => {
  try {
    // This will be used by the temp login endpoint
    // If the email is not found, it means they weren't invited
    const response = await axios.post(getApiUrl('/auth/check-invite-email'), {
      email
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
