import axios from "axios";
import { getApiUrl } from "../utils/api-url";

const baseUrl = getApiUrl('/community/redirect')

export const getRedirect = async (code: string) => {
  const response = await axios.get(`${baseUrl}/?t=${code}`);
  return response.data
}