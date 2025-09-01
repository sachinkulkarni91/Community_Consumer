import axios from "axios";

const baseUrl = '/community/join'

export const getRedirect = async (code: string) => {
  const response = await axios.get(`${baseUrl}/?t=${code}`);
  return response.data
}