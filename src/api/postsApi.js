import api from './axiosConfig'

export const getAllPosts = () => api.get('/posts')
export const getPostById = (id) => api.get(`/posts/${id}`)
export const createPost = (data) => api.post('/posts', data)
export const updatePost = (id, data) => api.put(`/posts/${id}`, data)
export const deletePost = (id) => api.delete(`/posts/${id}`)

// Corregido para coincidir con el backend
export const addImageToPost = (postId, imageId) =>
  api.post('/posts/add-image', { postId, imageId })
export const removeImageFromPost = (postId, imageId) =>
  api.delete('/posts/remove-image', { data: { postId, imageId } })
export const addTagToPost = (postId, tagId) =>
  api.post('/posts/add-tag', { postId, tagId })
export const removeTagFromPost = (postId, tagId) =>
  api.delete('/posts/remove-tag', { data: { postId, tagId } })