import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const statsValues = ['300+', '3', '5+']

export default function StudentLogin() {
  const [form, setForm] = useState({ rollNumber: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error' | 'success'
  const [errorType, setErrorType] = useState(null) // null | 'required' | 'mismatch'
  const { lang } = useLanguage()
  const t = translations[lang].login

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') {
      setStatus(null)
      setErrorType(null)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.rollNumber.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setErrorType('required')
      setStatus('error')
      return
    }
    if (form.password !== form.confirmPassword) {
      setErrorType('mismatch')
      setStatus('error')
      return
    }
    setErrorType(null)
    setStatus('loading')
    // Placeholder — replace with real signup when backend is ready
    setTimeout(() => setStatus('success'), 1200)
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
              {t.brandName.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
            <p className="login-left-brand-sub">{t.brandSub}</p>
          </div>
        </div>

        {/* Headline */}
        <div className="login-left-content">
          <h2 className="login-left-headline">
            {t.headline}
          </h2>
          <p className="login-left-desc">{t.desc}</p>
        </div>

        {/* Stats */}
        <div className="login-left-stats">
          {statsValues.map((value, i) => (
            <div key={t.statsLabels[i]}>
              <p className="login-left-stat-value">{value}</p>
              <p className="login-left-stat-label">{t.statsLabels[i]}</p>
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
            <ArrowLeft /> {t.backToHome}
          </Link>

          {/* Heading */}
          <p className="login-eyebrow">{t.eyebrow}</p>
          <h1 className="login-title">{t.title}</h1>
          <p className="login-subtitle">{t.subtitle}</p>

          {/* Alert */}
          {status === 'error' && (
            <motion.div
              className="login-alert login-alert-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <AlertCircle />
              {errorType === 'mismatch' ? t.passwordMismatchMsg : t.errorMsg}
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
              {t.successMsg}
            </motion.div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="rollNumber" className="login-label">{t.rollNumberLabel}</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                className="login-input"
                placeholder={t.rollNumberPlaceholder}
                autoComplete="username"
                value={form.rollNumber}
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">{t.passwordLabel}</label>
              <div className="login-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder={t.passwordPlaceholder}
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

            <div className="login-field">
              <label htmlFor="confirmPassword" className="login-label">{t.confirmPasswordLabel}</label>
              <div className="login-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder={t.confirmPasswordPlaceholder}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
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
                {t.rememberMe}
              </label>
              <a href="#" className="login-forgot" onClick={e => e.preventDefault()}>{t.forgotPassword}</a>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? t.signingUp : t.signUp}
            </button>
          </form>

          <div className="login-divider" style={{ marginTop: '1.5rem' }}>
            <span>{t.needHelp}</span>
          </div>

          <p className="login-notice">
            {t.contactNotice}{' '}
            <a href="mailto:tpo@sietpanchkula.ac.in">tpo@sietpanchkula.ac.in</a>
            {' '}{t.orCall}{' '}
            <a href="tel:+919253289394">+91 92532 89394</a>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
