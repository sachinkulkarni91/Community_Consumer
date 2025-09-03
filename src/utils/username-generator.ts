// Generate username from name
export const generateUsernameFromName = (name: string): string => {
  if (!name) return '';
  
  // Remove special characters and spaces, convert to lowercase
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15); // Limit length
  
  // Add random numbers to make it unique
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${cleanName}${randomSuffix}`;
}
