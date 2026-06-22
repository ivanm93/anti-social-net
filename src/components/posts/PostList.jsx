import PostCard from './PostCard'

export default function PostList({ posts, onPostDeleted, showComments }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="ti ti-mood-empty" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}></i>
        <p style={{ fontSize: 14 }}>No hay posts todavía</p>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onDeleted={onPostDeleted}
          showComments={showComments}
        />
      ))}
    </div>
  )
}