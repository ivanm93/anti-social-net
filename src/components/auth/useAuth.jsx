import Navbar from './Navbar'
import Sidebar from './Sidebar'
import TrendingPanel from './TrendingPanel'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function MainLayout({ children }) {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#f4f3fc' }}>
      <Navbar />
      <div
        className="container-xl px-3 px-md-4 mt-3 mt-md-4"
        style={{ margin: '0 auto' }}
      >
        <div className="row g-3">
          <div className="col-md-3 d-none d-md-block">
            <Sidebar />
          </div>
          <div className="col-12 col-md-6" style={{ paddingBottom: 70 }}>
            {children}
          </div>
          <div className="col-md-3 d-none d-lg-block">
            <TrendingPanel />
          </div>
        </div>
      </div>

      {/* Bottom nav - solo mobile */}
      <nav className="d-flex d-md-none fixed-bottom border-top justify-content-around py-2"
           style={{ background: 'white', zIndex: 1000 }}>
        <Link to="/" className="d-flex flex-column align-items-center text-decoration-none"
              style={{ color: '#3C3489', fontSize: 11 }}>
          <i className="ti ti-home" style={{ fontSize: 22 }}></i>
          <span>Inicio</span>
        </Link>
        <Link to="/explore" className="d-flex flex-column align-items-center text-decoration-none"
              style={{ color: '#888780', fontSize: 11 }}>
          <i className="ti ti-compass" style={{ fontSize: 22 }}></i>
          <span>Explorar</span>
        </Link>
        <Link to={`/profile/${user?.nickName}`}
              className="d-flex flex-column align-items-center text-decoration-none"
              style={{ color: '#888780', fontSize: 11 }}>
          <i className="ti ti-user" style={{ fontSize: 22 }}></i>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  )
}