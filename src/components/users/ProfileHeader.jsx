import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getInitials, getAvatarColors } from '../../utils/userHelpers'
import { followUser, unfollowUser } from '../../api/usersApi'

export default function ProfileHeader({ profileUser, postCount = 0 }) {
  const { user } = useAuth()
  const isOwn = user?.nickName === profileUser?.nickName
  const initials = getInitials(profileUser)
  const { bg, color } = getAvatarColors(profileUser?.nickName || '')

  const [followersCount, setFollowersCount] = useState(profileUser?.followers?.length || 0)
  const [isFollowing, setIsFollowing] = useState(
    profileUser?.followers?.some(f => f === user?._id || f?._id === user?._id)
  )
  const [loadingFollow, setLoadingFollow] = useState(false)

  const showFollowButton = user && !isOwn

  const handleToggleFollow = async () => {
    if (!profileUser?._id) return
    try {
      setLoadingFollow(true)

      if (isFollowing) {
        await unfollowUser({ userId: user._id, targetUserId: profileUser._id })
        setIsFollowing(false)
        setFollowersCount(prev => Math.max(prev - 1, 0))
      } else {
        await followUser({ userId: user._id, targetUserId: profileUser._id })
        setIsFollowing(true)
        setFollowersCount(prev => prev + 1)
      }
    } catch {
      alert('No se pudo actualizar el seguimiento')
    } finally {
      setLoadingFollow(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm p-4 mb-3" style={{ borderRadius: 14 }}>
      <div className="d-flex align-items-center gap-3 mb-3">
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 500, color, flexShrink: 0
        }}>
          {initials}
        </div>
        <div className="flex-grow-1">
          <h5 className="mb-0" style={{ fontWeight: 500, color: '#26215C' }}>
            {profileUser?.name || profileUser?.nickName}
          </h5>
          <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
            @{profileUser?.nickName}
          </p>
          {profileUser?.email && isOwn && (
            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
              <i className="ti ti-mail" style={{ fontSize: 13, verticalAlign: -1 }}></i>{' '}
              {profileUser.email}
            </p>
          )}
        </div>

        {showFollowButton && (
          <button
            className="btn btn-sm"
            style={{
              background: isFollowing ? 'white' : '#26215C',
              color: isFollowing ? '#26215C' : 'white',
              border: isFollowing ? '1px solid #CECBF6' : 'none',
              borderRadius: 8,
              fontSize: 12,
              minWidth: 110,
              padding: '6px 14px'
            }}
            onClick={handleToggleFollow}
            disabled={loadingFollow}
          >
            {loadingFollow
              ? '...'
              : isFollowing ? 'Dejar de seguir' : 'Seguir'
            }
          </button>
        )}
      </div>

      <div className="d-flex gap-4 pt-3" style={{ borderTop: '1px solid #EEEDFE' }}>
        <div className="text-center">
          <p className="mb-0" style={{ fontSize: 18, fontWeight: 500, color: '#26215C' }}>
            {postCount}
          </p>
          <p className="mb-0 text-muted" style={{ fontSize: 12 }}>Posts</p>
        </div>

        <div className="text-center">
          <p className="mb-0" style={{ fontSize: 18, fontWeight: 500, color: '#26215C' }}>
            {profileUser?.following?.length || 0}
          </p>
          <p className="mb-0 text-muted" style={{ fontSize: 12 }}>Siguiendo</p>
        </div>

        <div className="text-center">
          <p className="mb-0" style={{ fontSize: 18, fontWeight: 500, color: '#26215C' }}>
            {followersCount}
          </p>
          <p className="mb-0 text-muted" style={{ fontSize: 12 }}>Seguidores</p>
        </div>
      </div>
    </div>
  )
}