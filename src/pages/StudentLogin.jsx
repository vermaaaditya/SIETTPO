import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

const stats = [
  { value: '300+', label: 'Students' },
  { value: '3', label: 'Branches' },
  { value: '5+', label: 'Years' },
]

export default function StudentLogin() {
  const [form, setForm] = useState({ rollNumber: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error' | 'success'

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') setStatus(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.rollNumber.trim() || !form.password.trim()) {
      setStatus('error')
      return
    }
    setStatus('loading')
    // Placeholder — replace with real auth when backend is ready
    setTimeout(() => setStatus('error'), 1200)
  }

  return (
    <div className="login-page">
      {/* ── Left branding panel ── */}
      <motion.div
        className="login-left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <div className="login-left-grid" aria-hidden="true" />
        <div className="login-left-glow" aria-hidden="true" />
        <div className="login-left-glow-top" aria-hidden="true" />

        {/* Brand */}
        <div className="login-left-brand">
          <img src="/images/siet-logo.png" alt="SIET Panchkula" />
          <div>
            <p className="login-left-brand-name">
              State Institute of Engineering<br />&amp; Technology, Panchkula
            </p>
            <p className="login-left-brand-sub">Training &amp; Placement Cell</p>
          </div>
        </div>

        {/* Headline */}
        <div className="login-left-content">
          <h2 className="login-left-headline">
            Your <em>career</em><br />starts here.
          </h2>
          <p className="login-left-desc">
            Access your TPC portal to track placement drives, submit your profile, and stay updated on upcoming opportunities.
          </p>
        </div>

        {/* Stats */}
        <div className="login-left-stats">
          {stats.map(s => (
            <div key={s.label}>
              <p className="login-left-stat-value">{s.value}</p>
              <p className="login-left-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right form panel ── */}
      <div className="login-right">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0.9, 0.2, 1] }}
        >
          {/* Back link */}
          <Link to="/" className="login-back-link">
            <ArrowLeft /> Back to home
          </Link>

          {/* Heading */}
          <p className="login-eyebrow">TPC Student Portal</p>
          <h1 className="login-title">Student Login</h1>
          <p className="login-subtitle">
            Sign in with your institution roll number and TPC password.
          </p>

          {/* Alert */}
          {status === 'error' && (
            <motion.div
              className="login-alert login-alert-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <AlertCircle />
              Invalid roll number or password. Please try again or contact the TPO.
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              className="login-alert login-alert-success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <CheckCircle2 />
              Login successful! Redirecting to your dashboard…
            </motion.div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="rollNumber" className="login-label">Roll Number</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                className="login-input"
                placeholder="e.g. 2210001"
                autoComplete="username"
                value={form.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">Password</label>
              <div className="login-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="login-forgot" onClick={e => e.preventDefault()}>Forgot password?</a>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider" style={{ marginTop: '1.5rem' }}>
            <span>Need help?</span>
          </div>

          <p className="login-notice">
            Contact the TPO at{' '}
            <a href="mailto:tpo@sietpanchkula.ac.in">tpo@sietpanchkula.ac.in</a>
            {' '}or call{' '}
            <a href="tel:+919253289394">+91 92532 89394</a>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
