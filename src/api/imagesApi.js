import api from './axiosConfig'

// El modelo requiere { url, postId } juntos
export const createImage = (url, postId) =>
  api.post('/images', { url, postId })

export const deleteImage = (id) => api.delete(`/images/${id}`)
export const getAllImages = () => api.get('/images')