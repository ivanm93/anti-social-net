import { useState } from 'react'
import { createComment } from '../../api/commentsApi'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/userHelpers'

export default function CommentForm({ postId, onCommentAdded }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = getInitials(user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      setLoading(true)
      const { data } = await createComment(postId, {
        text,
        userId: user._id,   
      })
      onCommentAdded?.(data)
      setText('')
    } catch (err) {
      console.error('Error comentario:', err.response?.data)
      alert(err.response?.data?.message || 'No se pudo enviar el comentario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 align-items-center">
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: '#CECBF6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 500, color: '#3C3489', flexShrink: 0
      }}>
        {initials}
      </div>
      <div className="flex-grow-1 d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm bg-white"
          placeholder="Escribí un comentario..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ borderRadius: 20, fontSize: 13, border: '1px solid #CECBF6' }}
        />
        <button
          type="submit"
          className="btn btn-sm btn-purple"
          disabled={loading || !text.trim()}
          style={{ borderRadius: 20, padding: '4px 14px', fontSize: 13 }}
        >
          {loading
            ? <i className="ti ti-loader-2" style={{ fontSize: 14 }}></i>
            : <i className="ti ti-send" style={{ fontSize: 14 }}></i>
          }
        </button>
      </div>
    </form>
  )
}