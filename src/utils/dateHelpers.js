const MONTHS = import.meta.env.VITE_COMMENT_MONTHS || 6

export function isCommentVisible(dateString) {
  const commentDate = new Date(dateString)
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - Number(MONTHS))
  return commentDate >= cutoff
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
}

export function formatFullDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}