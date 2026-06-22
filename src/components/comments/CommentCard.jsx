import { deleteComment } from '../../api/commentsApi'
import { useAuth } from '../../context/AuthContext'
import { formatRelativeTime, isCommentVisible } from '../../utils/dateHelpers'
import { getInitials } from '../../utils/userHelpers'

export default function CommentCard({ comment, postId, onDeleted }) {
  const { user } = useAuth()

  if (!isCommentVisible(comment.createdAt)) return null

  const isOwner =
    user?._id === comment.author?._id ||
    user?.nickName === comment.author?.nickName

  const initials = getInitials(comment.author)

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminás este comentario?')) return
    try {
      await deleteComment(postId, comment._id)
      onDeleted?.(comment._id)
    } catch {
      alert('No se pudo eliminar el comentario')
    }
  }

  return (
    <div className="d-flex gap-2 align-items-start">
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: '#E1F5EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 500, color: '#0F6E56', flexShrink: 0, marginTop: 2
      }}>
        {initials}
      </div>
      <div className="flex-grow-1 px-3 py-2"
           style={{ background: 'white', borderRadius: 12, border: '1px solid #f0effe' }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#2C2C2A' }}>
              {comment.author?.name}
            </span>
            <span className="text-muted ms-2" style={{ fontSize: 11 }}>
              @{comment.author?.nickName} · {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          {isOwner && (
            <button
              className="btn btn-sm border-0 p-0 text-muted"
              onClick={handleDelete}
              style={{ lineHeight: 1 }}
            >
              <i className="ti ti-x" style={{ fontSize: 14 }}></i>
            </button>
          )}
        </div>
        <p className="mb-0 mt-1" style={{ fontSize: 13, color: '#444441', lineHeight: 1.5 }}>
          {comment.content}  
        </p>
      </div>
    </div>
  )
}