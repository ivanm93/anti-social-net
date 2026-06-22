import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllPosts } from '../api/postsApi'
import { getAllUsers } from '../api/usersApi'
import { getAllTags } from '../api/tagsApi'
import MainLayout from '../components/layout/MainLayout'
import PostList from '../components/posts/PostList'
import UserCard from '../components/users/UserCard'
import TagBadge from '../components/tags/TagBadge'

const TABS = ['Posts', 'Usuarios', 'Tags']

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialTag = searchParams.get('tag') || ''

  const [tab, setTab] = useState(initialTag ? 'Posts' : 'Posts')
  const [query, setQuery] = useState(initialQuery)
  const [activeTag, setActiveTag] = useState(initialTag)

  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [{ data: postsData }, { data: usersData }, { data: tagsData }] =
          await Promise.all([getAllPosts(), getAllUsers(), getAllTags()])
        setPosts(postsData)
        setUsers(usersData)
        setTags(tagsData)
      } catch {
 } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleTagClick = (tagName) => {
    setActiveTag(prev => prev === tagName ? '' : tagName)
    setQuery('')
    setTab('Posts')
  }

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setActiveTag('')
  }

  const filteredPosts = posts.filter(p => {
    if (activeTag) {
      return p.tags?.some(t => t.name.toLowerCase() === activeTag.toLowerCase())
    }
    if (query) {
      return (
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.user?.nickName?.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(t => t.name.toLowerCase().includes(query.toLowerCase()))
      )
    }
    return true
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const filteredUsers = users.filter(u =>
    !query ||
    u.name?.toLowerCase().includes(query.toLowerCase()) ||
    u.nickName?.toLowerCase().includes(query.toLowerCase())
  )

  const filteredTags = tags.filter(t =>
    !query || t.name?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="d-flex flex-column gap-3">

        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="ti ti-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Buscar posts, usuarios o tags..."
              value={query}
              onChange={handleSearch}
              style={{ fontSize: 14 }}
            />
            {(query || activeTag) && (
              <button
                className="btn bg-light border-0"
                onClick={() => { setQuery(''); setActiveTag('') }}
              >
                <i className="ti ti-x text-muted"></i>
              </button>
            )}
          </div>

          {activeTag && (
            <div className="mt-2 d-flex align-items-center gap-2">
              <span className="text-muted" style={{ fontSize: 12 }}>Filtrando por:</span>
              <TagBadge name={activeTag} onClick={() => setActiveTag('')} />
            </div>
          )}
        </div>

        <div className="d-flex gap-1 p-1"
             style={{ background: '#EEEDFE', borderRadius: 12 }}>
          {TABS.map(t => (
            <button
              key={t}
              className="btn btn-sm flex-fill"
              style={{
                borderRadius: 10,
                fontSize: 13,
                fontWeight: tab === t ? 500 : 400,
                background: tab === t ? '#3C3489' : 'transparent',
                color: tab === t ? '#EEEDFE' : '#3C3489',
                border: 'none',
                transition: 'all 0.15s'
              }}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm"
                 style={{ color: '#3C3489' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2 small">Explorando...</p>
          </div>
        ) : (
          <>
            {tab === 'Posts' && (
              <PostList posts={filteredPosts} />
            )}

            {tab === 'Usuarios' && (
              filteredUsers.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="ti ti-users" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}></i>
                  <p style={{ fontSize: 14 }}>No se encontraron usuarios</p>
                </div>
              ) : (
                <div className="row g-2">
                  {filteredUsers.map(u => (
                    <div key={u._id} className="col-12 col-sm-6">
                      <UserCard user={u} />
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'Tags' && (
              filteredTags.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="ti ti-tag" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}></i>
                  <p style={{ fontSize: 14 }}>No se encontraron tags</p>
                </div>
              ) : (
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 14 }}>
                  <div>
                    {filteredTags.map(tag => (
                      <TagBadge
                        key={tag._id}
                        name={tag.name}
                        onClick={() => handleTagClick(tag.name)}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}