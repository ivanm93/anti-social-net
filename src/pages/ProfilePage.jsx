import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAllUsers } from '../api/usersApi'
import { getAllPosts } from '../api/postsApi'
import MainLayout from '../components/layout/MainLayout'
import ProfileHeader from '../components/users/ProfileHeader'
import PostList from '../components/posts/PostList'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { nickName } = useParams()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        // Buscar usuario por nickName
        const { data: allUsers } = await getAllUsers()
        const userData = allUsers.find(u => u.nickName === nickName)
        if (!userData) throw new Error('Usuario no encontrado')
        setProfileUser(userData)

        // Filtrar posts por author (no user)
        const { data: allPosts } = await getAllPosts()
        const userPosts = allPosts
          .filter(p =>
            p.author?.nickName === nickName ||
            p.author?._id === userData._id
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPosts(userPosts)
      } catch {
        setError('No se pudo cargar el perfil')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [nickName])

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  if (loading) return (
    <MainLayout>
      <div className="text-center py-5">
        <div className="spinner-border spinner-border-sm" style={{ color: '#3C3489' }} role="status" />
        <p className="text-muted mt-2 small">Cargando perfil...</p>
      </div>
    </MainLayout>
  )

  if (error) return (
    <MainLayout>
      <div className="alert alert-danger" style={{ borderRadius: 12, fontSize: 14 }}>
        <i className="ti ti-alert-circle me-2"></i>{error}
      </div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <ProfileHeader profileUser={profileUser} postCount={posts.length} />
      <div className="mb-2 px-1">
        <p style={{ fontSize: 14, fontWeight: 500, color: '#26215C' }}>
          {nickName === currentUser?.nickName ? 'Tus posts' : `Posts de @${nickName}`}
        </p>
      </div>

      <PostList posts={posts} onPostDeleted={handlePostDeleted} />
    </MainLayout>
  )
}