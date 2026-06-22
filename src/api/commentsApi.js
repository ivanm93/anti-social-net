import api from './axiosConfig'

// GET /comments trae todos, filtramos por postId en el front
export const getCommentsByPost = async (postId) => {
  const { data } = await api.get('/comments')
  return { data: data.filter(c => c.postId?._id === postId || c.postId === postId) }
}

export const createComment = (postId, { text, userId }) =>
  api.post('/comments', {
    content: text,      // el backend espera "content"
    author: userId,     // el backend espera "author"
    postId,
  })

export const deleteComment = (postId, commentId) =>
  api.delete(`/comments/${commentId}`)