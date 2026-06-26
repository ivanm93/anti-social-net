import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/usersApi'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', nickName: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [registered, setRegistered] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'El nombre es requerido'
    if (!form.nickName.trim()) e.nickName = 'El nick es requerido'
    if (form.nickName.includes(' ')) e.nickName = 'El nick no puede tener espacios'
    if (!form.email.includes('@')) e.email = 'Email inválido'
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      setLoading(true)
      await registerUser(form)
      // Ya NO logueamos automáticamente, esperamos verificación de mail
      setRegistered(true)
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (msg.toLowerCase().includes('nick')) {
        setErrors({ nickName: 'Este nick ya está en uso' })
      } else {
        setErrors({ general: msg || 'Error al crear la cuenta' })
      }
    } finally {
      setLoading(false)
    }
  }

  // Pantalla de éxito: pedimos que revise el correo
  if (registered) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center"
           style={{ background: '#f4f3fc' }}>
        <div className="card border-0 shadow-sm p-4 text-center" style={{ width: '100%', maxWidth: 400, borderRadius: 16 }}>
          <i className="ti ti-mail" style={{ fontSize: 48, color: '#3C3489' }}></i>
          <h5 className="mt-3" style={{ color: '#26215C' }}>Usuario Creado correctamente</h5>
        </div>
      </div>
    )
  }

  // Formulario de registro
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4"
         style={{ background: '#f4f3fc' }}>
      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: 420, borderRadius: 16 }}>

        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3"
               style={{ width: 48, height: 48, background: '#26215C', borderRadius: 12 }}>
            <span style={{ color: '#EEEDFE', fontWeight: 500 }}>AN</span>
          </div>
          <h4 style={{ color: '#26215C', fontWeight: 500 }}>Crear cuenta</h4>
          <p className="text-muted small">Únite a la Anti-Social Net</p>
        </div>

        {errors.general && (
          <div className="alert alert-danger py-2 small">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">Nombre completo</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-user"></i>
              </span>
              <input type="text" name="name" className={`form-control border-start-0 bg-light ${errors.name ? 'is-invalid' : ''}`}
                     placeholder="Tu nombre" value={form.name} onChange={handleChange} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">
              Nick de usuario <span style={{ color: '#D4537E', fontSize: 11 }}>único</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-at"></i>
              </span>
              <input type="text" name="nickName" className={`form-control border-start-0 bg-light ${errors.nickName ? 'is-invalid' : ''}`}
                     placeholder="tu_nick" value={form.nickName} onChange={handleChange} />
              {errors.nickName && <div className="invalid-feedback">{errors.nickName}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-mail"></i>
              </span>
              <input type="email" name="email" className={`form-control border-start-0 bg-light ${errors.email ? 'is-invalid' : ''}`}
                     placeholder="correo@ejemplo.com" value={form.email} onChange={handleChange} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-medium">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="ti ti-lock"></i>
              </span>
              <input type={showPass ? 'text' : 'password'} name="password"
                     className={`form-control border-start-0 border-end-0 bg-light ${errors.password ? 'is-invalid' : ''}`}
                     placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} />
              <span className="input-group-text bg-light border-start-0"
                    style={{ cursor: 'pointer' }} onClick={() => setShowPass(!showPass)}>
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`}></i>
              </span>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-purple w-100 py-2" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <hr className="my-3" />
        <p className="text-center small text-muted mb-0">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#3C3489', fontWeight: 500 }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}