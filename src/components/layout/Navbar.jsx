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
         style={{ background: '#E3F2FD', borderBottom: '1px solid #BDE0FE' }}>
      <div className="container-fluid px-3">

        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div style={{
            width: 32, height: 32, background: '#0077B6',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>AN</span>
          </div>
          <span style={{ color: '#03045E', fontWeight: 600, fontSize: 15 }}>
            Anti-Social Net
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2 ms-auto">
          
          {/* Buscador */}
          <div className="input-group input-group-sm d-none d-md-flex"
               style={{ maxWidth: 220 }}>
            <span className="input-group-text"
                  style={{ background: '#FFFFFF', border: '1px solid #BDE0FE', borderRight: 'none' }}>
              <i className="ti ti-search" style={{ color: '#0077B6' }}></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar..."
              style={{ background: '#FFFFFF', border: '1px solid #BDE0FE', borderLeft: 'none', color: '#03045E' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/explore?q=${e.target.value}`)
              }}
            />
          </div>

          {/* Botón Inicio */}
          <Link to="/" className="btn btn-sm d-none d-md-flex align-items-center gap-1"
                style={{ color: '#0077B6', background: 'transparent', border: 'none' }}>
            <i className="ti ti-home" style={{ fontSize: 20 }}></i>
          </Link>

          {/* Botón Explorar */}
          <Link to="/explore" className="btn btn-sm d-none d-md-flex align-items-center gap-1"
                style={{ color: '#0077B6', background: 'transparent', border: 'none' }}>
            <i className="ti ti-compass" style={{ fontSize: 20 }}></i>
          </Link>

          {/* Dropdown de Usuario */}
          <div className="dropdown">
            <button className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2 p-1"
                    style={{ background: 'transparent', border: 'none', color: '#03045E' }}
                    data-bs-toggle="dropdown">
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#0077B6', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: '#FFFFFF'
              }}>
                {initials}
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: 14, fontWeight: 500 }}>
                @{user?.nickName}
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border"
                style={{ borderRadius: 12, minWidth: 180, borderColor: '#BDE0FE', background: '#FFFFFF' }}>
              <li>
                <Link to={`/profile/${user?.nickName}`} className="dropdown-item d-flex align-items-center gap-2" style={{ color: '#03045E' }}>
                  <i className="ti ti-user" style={{ fontSize: 16, color: '#0077B6' }}></i> Mi perfil
                </Link>
              </li>
              <li><hr className="dropdown-divider" style={{ backgroundColor: '#BDE0FE' }} /></li>
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