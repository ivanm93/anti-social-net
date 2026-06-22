import { Link } from 'react-router-dom'

const avatarColors = [
  { bg: '#CECBF6', color: '#3C3489' },
  { bg: '#9FE1CB', color: '#085041' },
  { bg: '#FAC775', color: '#633806' },
  { bg: '#F4C0D1', color: '#72243E' },
  { bg: '#B5D4F4', color: '#0C447C' },
]

function hashIndex(str = '') {
  return str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length
}

export default function UserCard({ user }) {
  const { bg, color } = avatarColors[hashIndex(user.nickName)]
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <Link to={`/profile/${user.nickName}`} className="text-decoration-none">
      <div className="card border-0 shadow-sm p-3 h-100"
           style={{ borderRadius: 14, transition: 'transform 0.15s' }}
           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
           onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: '50%', background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 500, color, flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <p className="mb-0" style={{ fontSize: 14, fontWeight: 500, color: '#2C2C2A' }}>
              {user.name}
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
              @{user.nickName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}