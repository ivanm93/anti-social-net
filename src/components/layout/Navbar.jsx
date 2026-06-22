import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/userHelpers'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }


const initials = getInitials(user)

  return (
    <nav className="navbar navbar-expand-lg sticky-top"
         style={{ background: '#26215C', borderBottom: '1px solid #3C3489' }}>
      <div className="container-fluid px-3">

        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div style={{
            width: 32, height: 32, background: '#AFA9EC',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#26215C', fontSize: 13, fontWeight: 600 }}>AN</span>
          </div>
          <span style={{ color: '#EEEDFE', fontWeight: 500, fontSize: 15 }}>
            Anti-Social Net
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <div className="input-group input-group-sm d-none d-md-flex"
               style={{ maxWidth: 220 }}>
            <span className="input-group-text"
                  style={{ background: '#3C3489', border: 'none' }}>
              <i className="ti ti-search" style={{ color: '#CECBF6' }}></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar..."
              style={{ background: '#3C3489', border: 'none', color: '#EEEDFE' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/explore?q=${e.target.value}`)
              }}
            />
          </div>

          <Link to="/" className="btn btn-sm d-none d-md-flex align-items-center gap-1"
                style={{ color: '#CECBF6', background: 'transparent', border: 'none' }}>
            <i className="ti ti-home" style={{ fontSize: 20 }}></i>
          </Link>

          <Link to="/explore" className="btn btn-sm d-none d-md-flex align-items-center gap-1"
                style={{ color: '#CECBF6', background: 'transparent', border: 'none' }}>
            <i className="ti ti-compass" style={{ fontSize: 20 }}></i>
          </Link>

          <div className="dropdown">
            <button className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2 p-1"
                    style={{ background: 'transparent', border: 'none', color: '#EEEDFE' }}
                    data-bs-toggle="dropdown">
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#CECBF6', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 500, color: '#3C3489'
              }}>
                {initials}
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: 14 }}>
                @{user?.nickName}
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0"
                style={{ borderRadius: 12, minWidth: 180 }}>
              <li>
                <Link to={`/profile/${user?.nickName}`} className="dropdown-item d-flex align-items-center gap-2">
                  <i className="ti ti-user" style={{ fontSize: 16 }}></i> Mi perfil
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}>
                  <i className="ti ti-logout" style={{ fontSize: 16 }}></i> Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}