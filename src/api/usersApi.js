import api from './axiosConfig'

export const registerUser = (data) => api.post('/users', data)
export const loginUser = (data) => api.post('/users/login', data)
export const getAllUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const getUserByNick = async (nickName) => {
  const { data } = await api.get('/users')
  const found = data.find(u => u.nickName === nickName)
  if (!found) throw new Error('Usuario no encontrado')
  return { data: found }
}
export const followUser = (data) => api.post('/users/follow', data)
export const unfollowUser = (data) => api.delete('/users/unfollow', { data })