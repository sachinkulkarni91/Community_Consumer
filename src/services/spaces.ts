import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

axios.defaults.withCredentials = true

// Get all spaces in a community
export const getSpaces = async (communityId: string) => {
  const res = await axios.get(getApiUrl(`/api/communities/${communityId}/spaces`))
  return res.data
}

// Create a new space in a community
export const createSpace = async (
  communityId: string,
  name: string,
  type: 'chat' | 'feed',
  description: string
) => {
  const res = await axios.post(getApiUrl(`/api/communities/${communityId}/spaces`), {
    name,
    type,
    description
  })
  return res.data
}

export const getSpace = async (spaceId: string): Promise<RawSpace> => {
  const response = await axios.get<RawSpace>(getApiUrl(`/api/communities/spaces/${spaceId}`));
  return response.data;
};
