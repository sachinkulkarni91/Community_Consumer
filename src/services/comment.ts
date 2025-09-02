// services/comment.ts

import axios from 'axios'
import { getApiUrl } from '../utils/api-url'

// Get all the comments for a post
export const getCommentsForPost = async (postId: string): Promise<RawComment[]> => {
  const response = await axios.get<RawComment[]>(getApiUrl(`/api/posts/${postId}/comments`));
  return response.data;
};

// Create a new comment for a post
export const addCommentToPost = async (
  postId: string,
  content: string,
  parentCommentId?: string
): Promise<RawComment> => {
  const response = await axios.post<RawComment>(getApiUrl(`/api/posts/${postId}/comments`), {
    content,
    parentComment: parentCommentId
  }, { withCredentials: true });

  return response.data;
};

// Like a comment
export const likeComment = async (commentId: string) => {
  const res = await axios.put(getApiUrl(`/api/comments/${commentId}/like`))
  return res.data
}

// Edit a comment
export const updateComment = async (commentId: string, content: string) => {
  const res = await axios.put(getApiUrl(`/api/comments/${commentId}`), {
    content
  })
  return res.data
}

// Delete a comment
export const deleteComment = async (commentId: string) => {
  const res = await axios.delete(getApiUrl(`/api/comments/${commentId}`))
  return res.data
}
