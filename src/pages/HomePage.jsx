import { useState, useEffect, useCallback } from 'react'
import { getAllPosts } from '../api/postsApi'
import MainLayout from '../components/layout/MainLayout'
import PostForm from '../components/posts/PostForm'
import PostList from '../components/posts/PostList'

export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await getAllPosts()
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setPosts(sorted)
    } catch {
      setError('No se pudieron cargar los posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  return (
    <MainLayout>
      <div className="d-flex flex-column gap-3">
        <PostForm onPostCreated={handlePostCreated} />

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm"
                 style={{ color: '#3C3489' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 small">Cargando posts...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger d-flex align-items-center gap-2"
               style={{ borderRadius: 12, fontSize: 14 }}>
            <i className="ti ti-alert-circle"></i>
            {error}
            <button className="btn btn-sm ms-auto" onClick={fetchPosts}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <PostList posts={posts} onPostDeleted={handlePostDeleted} />
        )}
      </div>
    </MainLayout>
  )
}