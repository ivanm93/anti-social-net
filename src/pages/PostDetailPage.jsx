import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById, updatePost, removeImageFromPost } from '../api/postsApi'
import { getCommentsByPost } from '../api/commentsApi'
import { getAllTags, addTagToPost, removeTagFromPost } from '../api/tagsApi'
import { createImage } from '../api/imagesApi'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../components/layout/MainLayout'
import CommentForm from '../components/comments/CommentForm'
import CommentCard from '../components/comments/CommentCard'
import TagBadge from '../components/tags/TagBadge'
import { formatFullDate } from '../utils/dateHelpers'
import { getInitials, getAvatarColors } from '../utils/userHelpers'
import { uploadImage } from '../utils/cloudinary'

export default function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  // Data
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [allTags, setAllTags] = useState([])

  // UI states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [showTagEditor, setShowTagEditor] = useState(false)

  // Imagen upload
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [addingImage, setAddingImage] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [{ data: postData }, { data: commentData }, { data: tagData }] =
          await Promise.all([
            getPostById(id),
            getCommentsByPost(id),
            getAllTags(),
          ])
        setPost(postData)
        setEditDesc(postData.description)
        setComments(commentData)
        setAllTags(tagData)
      } catch {
        setError('No se pudo cargar el post')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const isOwner = post
    ? (user?._id === post.author?._id || user?.nickName === post.author?.nickName)
    : false

  const initials = getInitials(post?.author)
  const { bg, color } = getAvatarColors(post?.author?.nickName || '')

  // --- Handlers ---

  const handleSaveEdit = async () => {
    if (!editDesc.trim()) return
    try {
      setSaving(true)
      const { data } = await updatePost(id, { description: editDesc })
      setPost(data)
      setEditing(false)
    } catch {
      alert('No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleAddImage = async () => {
    if (!imageFile) return
    try {
      setAddingImage(true)
      const imageUrl = await uploadImage(imageFile)
      await createImage(imageUrl, id)
      const { data: refreshed } = await getPostById(id)
      setPost(refreshed)
      setImageFile(null)
      setImagePreview(null)
      setShowImageForm(false)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      console.error('Error al agregar imagen:', err)
      alert('No se pudo agregar la imagen')
    } finally {
      setAddingImage(false)
    }
  }

  const handleRemoveImage = async (imageId) => {
    if (!window.confirm('¿Eliminás esta imagen?')) return
    try {
      await removeImageFromPost(id, imageId)
      const { data: refreshed } = await getPostById(id)
      setPost(refreshed)
    } catch {
      alert('No se pudo eliminar la imagen')
    }
  }

  const handleToggleTag = async (tag) => {
    const hasTag = post.tags?.find(t => t._id === tag._id)
    try {
      if (hasTag) {
        await removeTagFromPost(id, tag._id)
        setPost(prev => ({ ...prev, tags: prev.tags.filter(t => t._id !== tag._id) }))
      } else {
        await addTagToPost(id, tag._id)
        setPost(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }))
      }
    } catch {
      alert('No se pudo actualizar el tag')
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment])
  }

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c._id !== commentId))
  }

  // --- Loading / Error states ---

  if (loading) return (
    <MainLayout>
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm"
             style={{ color: '#3C3489' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2 small">Cargando post...</p>
      </div>
    </MainLayout>
  )

  if (error || !post) return (
    <MainLayout>
      <div className="alert alert-danger" style={{ borderRadius: 12, fontSize: 14 }}>
        <i className="ti ti-alert-circle me-2"></i>
        {error || 'Post no encontrado'}
      </div>
    </MainLayout>
  )

  // --- Render ---

  return (
    <MainLayout>

      {/* Botón volver */}
      <button
        className="btn btn-sm d-flex align-items-center gap-1 mb-3 text-muted"
        onClick={() => navigate(-1)}
        style={{ border: 'none', background: 'transparent', fontSize: 13 }}
      >
        <i className="ti ti-arrow-left" style={{ fontSize: 16 }}></i>
        Volver
      </button>

      {/* Card del post */}
      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
        <div className="p-4">

          {/* Header autor */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center gap-2">
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, fontWeight: 500,
                color, flexShrink: 0
              }}>
                {initials}
              </div>
              <div>
                <p className="mb-0" style={{ fontSize: 14, fontWeight: 500 }}>
                  {post.author?.name || post.author?.nickName}
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                  @{post.author?.nickName} · {formatFullDate(post.createdAt)}
                </p>
              </div>
            </div>

            {isOwner && !editing && (
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  fontSize: 13, color: '#3C3489',
                  background: '#EEEDFE', border: 'none', borderRadius: 8
                }}
                onClick={() => setEditing(true)}
              >
                <i className="ti ti-edit" style={{ fontSize: 15 }}></i>
                Editar
              </button>
            )}
          </div>

          {/* Descripción / Editor */}
          {editing ? (
            <div className="mb-3">
              <textarea
                className="form-control bg-light border-0"
                rows={4}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                style={{ borderRadius: 10, fontSize: 14, resize: 'none' }}
              />
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-purple px-3"
                  style={{ borderRadius: 20, fontSize: 13 }}
                  onClick={handleSaveEdit}
                  disabled={saving || !editDesc.trim()}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    borderRadius: 20, fontSize: 13,
                    border: '1px solid #CECBF6', color: '#3C3489'
                  }}
                  onClick={() => { setEditing(false); setEditDesc(post.description) }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2C2C2A' }}>
              {post.description}
            </p>
          )}

          {/* Imágenes del post */}
          {post.images?.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-muted" style={{ fontSize: 12 }}>
                <i className="ti ti-photo me-1"></i>
                Imágenes ({post.images.length})
              </p>
              <div className="d-flex flex-column gap-2">
                {post.images.map((img, i) => (
                  <div key={img._id || i} className="position-relative">
                    <img
                      src={img.url}
                      alt=""
                      className="w-100"
                      style={{ borderRadius: 10, maxHeight: 400, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    {isOwner && (
                      <button
                        className="btn btn-sm position-absolute top-0 end-0 m-2"
                        style={{
                          background: 'rgba(255,255,255,0.9)', border: 'none',
                          borderRadius: 8, color: '#E24B4A', fontSize: 12
                        }}
                        onClick={() => handleRemoveImage(img._id)}
                      >
                        <i className="ti ti-trash" style={{ fontSize: 14 }}></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agregar imagen — solo owner */}
          {isOwner && (
            <div className="mb-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {showImageForm ? (
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <button
                    className="btn btn-sm"
                    style={{ border: '1px dashed #CECBF6', borderRadius: 8, fontSize: 12 }}
                    onClick={() => fileRef.current?.click()}
                    type="button"
                  >
                    <i className="ti ti-upload me-1"></i>
                    {imageFile ? imageFile.name.slice(0, 20) + '...' : 'Elegir imagen'}
                  </button>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{ height: 48, borderRadius: 8, objectFit: 'cover' }}
                    />
                  )}

                  <button
                    className="btn btn-sm btn-purple"
                    style={{ borderRadius: 8, fontSize: 12, whiteSpace: 'nowrap' }}
                    onClick={handleAddImage}
                    disabled={addingImage || !imageFile}
                  >
                    {addingImage ? 'Subiendo...' : 'Agregar'}
                  </button>

                  <button
                    className="btn btn-sm"
                    style={{
                      borderRadius: 8, fontSize: 12,
                      border: '1px solid #CECBF6', color: '#3C3489'
                    }}
                    onClick={() => {
                      setShowImageForm(false)
                      setImageFile(null)
                      setImagePreview(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-sm d-flex align-items-center gap-1 text-muted"
                  style={{
                    border: '1px dashed #CECBF6', borderRadius: 8,
                    fontSize: 12, background: 'transparent'
                  }}
                  onClick={() => setShowImageForm(true)}
                >
                  <i className="ti ti-plus" style={{ fontSize: 14 }}></i>
                  Agregar imagen
                </button>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="mb-2">
            {post.tags?.map(tag => (
              <TagBadge key={tag._id} name={tag.name} />
            ))}
          </div>

          {/* Editor de tags — solo owner */}
          {isOwner && (
            <div>
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  fontSize: 12, color: '#3C3489',
                  background: showTagEditor ? '#EEEDFE' : 'transparent',
                  border: '1px solid #CECBF6', borderRadius: 8
                }}
                onClick={() => setShowTagEditor(!showTagEditor)}
              >
                <i className="ti ti-tag" style={{ fontSize: 14 }}></i>
                Editar tags
              </button>

              {showTagEditor && (
                <div className="mt-2 p-2 rounded-3" style={{ background: '#f8f7ff' }}>
                  {allTags.map(tag => {
                    const active = post.tags?.find(t => t._id === tag._id)
                    return (
                      <span
                        key={tag._id}
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px', borderRadius: 999,
                          fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          marginRight: 4, marginBottom: 4,
                          background: active ? '#3C3489' : '#EEEDFE',
                          color: active ? '#EEEDFE' : '#3C3489',
                        }}
                      >
                        #{tag.name}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card de comentarios */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="p-3">
          <p className="mb-3" style={{ fontSize: 14, fontWeight: 500, color: '#26215C' }}>
            <i className="ti ti-message me-1"></i>
            Comentarios ({comments.length})
          </p>

          {comments.length === 0 ? (
            <p className="text-center text-muted mt-4 mb-2" style={{ fontSize: 13 }}>
              Todavía no hay comentarios. ¡Sé el primero!
            </p>
          ) : (
            <div className="d-flex flex-column gap-2 mt-3">
              {comments.map(comment => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  postId={id}
                  onDeleted={handleCommentDeleted}
                />
              ))}
            </div>
          )}
                    <CommentForm postId={id} onCommentAdded={handleCommentAdded} />

        </div>
      </div>

    </MainLayout>
  )
}