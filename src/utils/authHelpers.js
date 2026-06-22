export function extractToken(responseData) {
  if (responseData.token) return responseData.token
  if (responseData.data?.token) return responseData.data.token
  if (responseData.accessToken) return responseData.accessToken
  return null
}

export function extractUser(responseData) {
  if (responseData.user) return responseData.user
  if (responseData.data?.user) return responseData.data.user
  if (responseData._id || responseData.nickName) return responseData
  return null
}