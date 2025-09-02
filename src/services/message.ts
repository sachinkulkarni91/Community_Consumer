import axios from 'axios';
import { getApiUrl } from '../utils/api-url';

export const sendMessageToSpace = async (
  spaceId: string,
  content: string
): Promise<RawMessage> => {
  const response = await axios.post<RawMessage>(
    getApiUrl(`/api/communities/spaces/${spaceId}/messages`),
    { content },
    { withCredentials: true }
  );
  return response.data;
};