import api from './axiosConfig'

export const getAllTags = () => api.get('/tags')
export const createTag = (data) => api.post('/tags', data)
export const addTagToPost = (postId, tagId) =>
  api.post('/posts/add-tag', { postId, tagId })
export const removeTagFromPost = (postId, tagId) =>
  api.delete('/posts/remove-tag', { data: { postId, tagId } })