import { useState, useEffect, useRef } from 'react'
import { createPost, addTagToPost, getPostById } from '../../api/postsApi'
import { createImage } from '../../api/imagesApi'
import { getAllTags } from '../../api/tagsApi'
import { useAuth } from '../../context/AuthContext'
import { uploadImage } from '../../utils/cloudinary'
import { getInitials } from '../../utils/userHelpers'
import TagBadge from '../tags/TagBadge'

export default function PostForm({ onPostCreated }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [description, setDescription] = useState('')
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Preview de imagen
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const initials = getInitials(user)

  useEffect(() => {
    getAllTags().then(({ data }) => setAllTags(data)).catch(() => {})
  }, [])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.find(t => t._id === tag._id)
        ? prev.filter(t => t._id !== tag._id)
        : [...prev, tag]
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('La descripción es obligatoria')
      return
    }
    try {
      setLoading(true)
      setError('')

      // Paso 1: crear el post
      const { data: newPost } = await createPost({
        description: description.trim(),
        author: user._id,
      })
      const postId = newPost._id

      // Paso 2: subir imagen a Cloudinary y guardar URL
      if (imageFile) {
        try {
          setUploadingImage(true)
          const imageUrl = await uploadImage(imageFile)
          await createImage(imageUrl, postId)
        } catch (imgErr) {
          console.warn('No se pudo subir la imagen:', imgErr)
        } finally {
          setUploadingImage(false)
        }
      }

      // Paso 3: asociar tags
      for (const tag of selectedTags) {
        try {
          await addTagToPost(postId, tag._id)
        } catch (tagErr) {
          console.warn('No se pudo agregar el tag:', tagErr)
        }
      }

      // Paso 4: traer post completo
      const { data: fullPost } = await getPostById(postId)
      onPostCreated?.(fullPost)

      // Limpiar
      setDescription('')
      setImageFile(null)
      setImagePreview(null)
      setSelectedTags([])
      setShowTagPicker(false)
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (err) {
      const msg = err.response?.data?.message || 'Error al publicar'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
      <div className="d-flex gap-3">
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: '#CECBF6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500, color: '#3C3489', flexShrink: 0
        }}>
          {initials}
        </div>

        <div className="flex-grow-1">
          <textarea
            className="form-control border-0 bg-light"
            rows={3}
            placeholder="¿Qué estás pensando?"
            value={description}
            onChange={e => { setDescription(e.target.value); setError('') }}
            style={{ resize: 'none', borderRadius: 10, fontSize: 14 }}
          />

          {error && <p className="text-danger small mt-1 mb-0">{error}</p>}

          {/* Preview imagen */}
          {imagePreview && (
            <div className="mt-2 position-relative d-inline-block">
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  maxHeight: 200, maxWidth: '100%',
                  borderRadius: 10, objectFit: 'cover'
                }}
              />
              <button
                className="btn btn-sm position-absolute top-0 end-0 m-1"
                style={{
                  background: 'rgba(0,0,0,0.5)', border: 'none',
                  borderRadius: '50%', color: 'white',
                  width: 24, height: 24, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onClick={handleRemoveImage}
              >
                <i className="ti ti-x" style={{ fontSize: 12 }}></i>
              </button>
            </div>
          )}

          {/* Selector de tags */}
          {showTagPicker && allTags.length > 0 && (
            <div className="mt-2 p-2 rounded-3" style={{ background: '#f8f7ff' }}>
              <p className="mb-1 text-muted" style={{ fontSize: 11 }}>
                Seleccioná etiquetas:
              </p>
              <div>
                {allTags.map(tag => (
                  <span
                    key={tag._id}
                    onClick={() => toggleTag(tag)}
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px', borderRadius: 999,
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      marginRight: 4, marginBottom: 4,
                      background: selectedTags.find(t => t._id === tag._id)
                        ? '#3C3489' : '#EEEDFE',
                      color: selectedTags.find(t => t._id === tag._id)
                        ? '#EEEDFE' : '#3C3489',
                    }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedTags.length > 0 && !showTagPicker && (
            <div className="mt-2">
              {selectedTags.map(t => <TagBadge key={t._id} name={t.name} />)}
            </div>
          )}

          {/* Input file oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  color: '#3C3489',
                  background: imagePreview ? '#EEEDFE' : 'transparent',
                  border: 'none', borderRadius: 8
                }}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <i className="ti ti-photo" style={{ fontSize: 18 }}></i>
                <span style={{ fontSize: 12 }}>
                  {imageFile ? imageFile.name.slice(0, 15) + '...' : 'Imagen'}
                </span>
              </button>

              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                style={{
                  color: '#3C3489',
                  background: showTagPicker ? '#EEEDFE' : 'transparent',
                  border: 'none', borderRadius: 8
                }}
                onClick={() => setShowTagPicker(!showTagPicker)}
                type="button"
              >
                <i className="ti ti-tag" style={{ fontSize: 18 }}></i>
                <span style={{ fontSize: 12 }}>Tags</span>
              </button>
            </div>

            <button
              className="btn btn-sm btn-purple px-4"
              style={{ borderRadius: 20, fontSize: 13 }}
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
            >
              {loading
                ? uploadingImage
                  ? 'Subiendo imagen...'
                  : 'Publicando...'
                : 'Publicar'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}