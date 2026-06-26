import Navbar from './Navbar'
import Sidebar from './Sidebar'
import TrendingPanel from './TrendingPanel'

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f3fc' }}>
      <Navbar />
      <div
        className="container-xl px-3 px-md-4 mt-3 mt-md-4"
        style={{ margin: '0 auto' }}
      >
  <div className="row g-3">

  {/* Sidebar */}
  <div className="col-md-3 order-2 order-md-1">
    <Sidebar />
  </div>

  {/* Feed */}
  <div className="col-12 col-md-6 order-1 order-md-2">
    {children}

    {/* 👇 Trending pasa acá en mobile */}
    <div className="d-block d-md-none mt-3">
      <TrendingPanel />
    </div>
  </div>

  {/* Trending desktop */}
  <div className="col-md-3 d-none d-md-block order-md-3">
    <TrendingPanel />
  </div>

</div>
      </div>

      {/* Navbar mobile abajo */}
      <nav className="d-flex d-md-none fixed-bottom border-top bg-white justify-content-around py-2"
           style={{ zIndex: 1000 }}>
        <a href="/" className="d-flex flex-column align-items-center text-decoration-none"
           style={{ color: '#3C3489', fontSize: 11 }}>
          <i className="ti ti-home" style={{ fontSize: 22 }}></i>
          <span>Inicio</span>
        </a>
        <a href="/explore" className="d-flex flex-column align-items-center text-decoration-none"
           style={{ color: '#888780', fontSize: 11 }}>
          <i className="ti ti-compass" style={{ fontSize: 22 }}></i>
          <span>Explorar</span>
        </a>
        <a href={`/profile/${''}`} className="d-flex flex-column align-items-center text-decoration-none"
           style={{ color: '#888780', fontSize: 11 }}>
          <i className="ti ti-user" style={{ fontSize: 22 }}></i>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  )
}