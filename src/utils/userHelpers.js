export function getInitials(user) {
  if (!user) return '??'
  if (user.name && user.name.trim()) {
    return user.name
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (user.nickName) {
    return user.nickName.slice(0, 2).toUpperCase()
  }
  return '??'
}

export function getAvatarColors(seed = '') {
  const palette = [
    { bg: '#CECBF6', color: '#3C3489' },
    { bg: '#9FE1CB', color: '#085041' },
    { bg: '#FAC775', color: '#633806' },
    { bg: '#F4C0D1', color: '#72243E' },
    { bg: '#B5D4F4', color: '#0C447C' },
  ]
  const index = seed
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length
  return palette[index]
}