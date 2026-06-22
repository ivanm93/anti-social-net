import axios from './axiosConfig'

export const loginUser = (credentials) =>
  axios.post('/auth/login', credentials)

export const registerUser = (userData) =>
  axios.post('/users', userData)