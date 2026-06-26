import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/userHelpers'

const navItems = [
  { to: '/',        icon: 'ti-home',    label: 'Inicio' },
  { to: '/explore', icon: 'ti-compass', label: 'Explorar' },
]

export default function Sidebar() {
  const { user } = useAuth()

const initials = getInitials(user)



  return (
    <div className="d-flex flex-column gap-3" style={{ position: 'sticky', top: 76 }}>

      <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
        <div className="d-flex align-items-center gap-2 mb-3 pb-2"
             style={{ borderBottom: '1px solid #EEEDFE' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#CECBF6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 500, color: '#3C3489', flexShrink: 0
          }}>
            {initials}
          </div>
          <div>
            <p className="mb-0" style={{ fontSize: 14, fontWeight: 500 }}>
              {user?.name}
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
              @{user?.nickName}
            </p>
          </div>
        </div>

        <nav className="d-flex flex-column gap-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
                  isActive
                    ? 'fw-medium'
                    : 'text-muted'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? '#EEEDFE' : 'transparent',
                color: isActive ? '#3C3489' : undefined,
                fontSize: 14,
                transition: 'background 0.15s'
              })}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 18 }}></i>
              {label}
            </NavLink>
          ))}

          <NavLink
            to={`/profile/${user?.nickName}`}
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
                isActive ? 'fw-medium' : 'text-muted'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? '#EEEDFE' : 'transparent',
              color: isActive ? '#3C3489' : undefined,
              fontSize: 14,
              transition: 'background 0.15s'
            })}
          >
            <i className="ti ti-user" style={{ fontSize: 18 }}></i>
            Mi perfil
          </NavLink>
        </nav>
      </div>
    
    </div>
  )
}