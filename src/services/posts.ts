import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

axios.defaults.withCredentials = true

// Get all posts
export const getAllPosts = async () => {
  const res = await axios.get(getApiUrl('/api/posts'))
  return res.data
}

// Get a single post by ID
export const getPostById = async (id: string) => {
  const res = await axios.get(getApiUrl(`/api/posts/${id}`))
  return res.data
}

// Get all posts by community
export const getCommunityPosts = async (communityId: string) => {
  const res = await axios.get(getApiUrl(`/api/posts/community/${communityId}`))
  return res.data
}

// Create a new post
export const createPost = async (title: string, content: string, authorID: string, communityID: string, spaceID: string | null = null) => {
  const res = await axios.post(getApiUrl('/api/posts'), {
    title,
    content,
    author: authorID,
    community: communityID,
    space: spaceID
  })
  return res.data
}

// Like a post
export const likePost = async (postId: string) => {
  const res = await axios.put(getApiUrl(`/api/posts/${postId}/like`))
  return res.data
}

// Like a post
export const unlikePost = async (postId: string) => {
  const res = await axios.put(getApiUrl(`/api/posts/${postId}/unlike`))
  return res.data
}

// Delete a post
export const deletePost = async (postId: string) => {
  const res = await axios.delete(getApiUrl(`/api/posts/${postId}`))
  return res.data
}
