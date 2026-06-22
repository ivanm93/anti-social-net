import { useState, useEffect,useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axiosConfig'

export default function VerifyEmailPage() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')
  const executed = useRef(false)

useEffect(() => {
  if (executed.current) return

  executed.current = true

  const verify = async () => {
    try {
      const { data } = await api.get(`/users/verify/${token}`)
      setStatus('success')
      setMessage(data.message)
    } catch (err) {
      setStatus('error')
      setMessage(
        err.response?.data?.message ||
        'No se pudo verificar la cuenta'
      )
    }
  }

  verify()
}, [token])

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: '#f4f3fc' }}>
      <div className="card border-0 shadow-sm p-4 text-center" style={{ width: '100%', maxWidth: 400, borderRadius: 16 }}>

        {status === 'loading' && (
          <>
            <div className="spinner-border" style={{ color: '#3C3489' }} role="status" />
            <p className="mt-3 text-muted">Verificando tu cuenta...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <i className="ti ti-circle-check" style={{ fontSize: 48, color: '#0F6E56' }}></i>
            <h5 className="mt-3" style={{ color: '#26215C' }}>¡Cuenta verificada!</h5>
            <p className="text-muted small">{message}</p>
            <Link to="/login" className="btn btn-purple w-100 mt-2">
              Iniciar sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <i className="ti ti-circle-x" style={{ fontSize: 48, color: '#E24B4A' }}></i>
            <h5 className="mt-3" style={{ color: '#26215C' }}>No se pudo verificar</h5>
            <p className="text-muted small">{message}</p>
            <Link to="/register" className="btn btn-purple w-100 mt-2">
              Volver a registrarme
            </Link>
          </>
        )}
      </div>
    </div>
  )
}