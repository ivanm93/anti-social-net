import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/usersApi'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!form.email || !form.password) {
    setError('Completá todos los campos')
    return
  }
  try {
    setLoading(true)
    const { data } = await loginUser(form)  // manda { email, password }
    login(data)
    navigate('/')
  } catch (err) {
    setError(err.response?.data?.message || 'Email o contraseña incorrectos')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: '#f4f3fc' }}>
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: 400, borderRadius: 16 }}>

        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3"
               style={{ width: 48, height: 48, background: '#26215C', borderRadius: 12 }}>
            <span style={{ color: '#EEEDFE', fontWeight: 500 }}>AN</span>
          </div>
          <h4 style={{ color: '#26215C', fontWeight: 500 }}>Bienvenido de vuelta</h4>
          <p className="text-muted small">Iniciá sesión para continuar</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">eMail</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-at"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 bg-light"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-medium">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-lock"></i>
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="form-control border-start-0 border-end-0 bg-light"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <span className="input-group-text bg-light border-start-0"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPass(!showPass)}>
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-purple w-100 py-2" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center small text-muted mb-0">
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: '#3C3489', fontWeight: 500 }}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}