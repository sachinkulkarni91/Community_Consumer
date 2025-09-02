// Utility function to get the correct API base URL
export const getApiUrl = (endpoint: string): string => {
  // In development, use proxy. In production, use full backend URL
  if (import.meta.env.DEV) {
    return endpoint
  }
  return `${import.meta.env.VITE_API_URL}${endpoint}`
}

export default getApiUrl
