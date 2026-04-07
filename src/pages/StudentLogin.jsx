import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const statsValues = ['300+', '3', '5+']
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : {}
const preferredCollegeEmailDomains = (env.VITE_COLLEGE_EMAIL_DOMAINS || '')
  .split(',')
  .map(domain => domain.trim().toLowerCase())
  .filter(Boolean)
const preferredCollegeEmailKeyword = (env.VITE_COLLEGE_EMAIL_KEYWORD || 'siet').trim().toLowerCase()
const signupRequiredFields = ['fullName', 'signupEmail', 'signupPassword', 'confirmPassword', 'rollNumber', 'branch', 'batch']
const initialFormState = {
  fullName: '',
  signupEmail: '',
  loginEmail: '',
  loginPassword: '',
  signupPassword: '',
  confirmPassword: '',
  rollNumber: '',
  branch: '',
  batch: '',
}

export default function StudentLogin() {
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState(initialFormState)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error' | 'success'
  const [statusMessage, setStatusMessage] = useState('')
  const submitTimeoutRef = useRef(null)
  const { lang } = useLanguage()
  const t = translations[lang].login

  useEffect(() => () => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
    }
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') {
      setStatus(null)
      setStatusMessage('')
    }
  }

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setStatus(null)
    setStatusMessage('')
  }

  function isValidEmail(value) {
    const email = value.trim()
    if (!email) {
      return false
    }
    const input = document.createElement('input')
    input.type = 'email'
    input.value = email
    return input.checkValidity()
  }

  function isPreferredCollegeEmail(value) {
    const normalized = value.trim().toLowerCase()
    const atIndex = normalized.lastIndexOf('@')
    const domain = atIndex >= 0 ? normalized.slice(atIndex + 1) : ''
    if (!domain) {
      return false
    }
    if (preferredCollegeEmailDomains.length > 0) {
      return preferredCollegeEmailDomains.some(preferredDomain =>
        domain === preferredDomain || domain.endsWith(`.${preferredDomain}`)
      )
    }
    return domain.includes(preferredCollegeEmailKeyword)
  }

  function getValidationError() {
    if (mode === 'login') {
      if (!form.loginEmail.trim() || !form.loginPassword.trim()) {
        return t.errorRequiredMsg
      }
      if (!isValidEmail(form.loginEmail.trim())) {
        return t.invalidEmailMsg
      }
      if (form.loginPassword.trim().length < 6) {
        return t.passwordMinMsg
      }
      return null
    }

    if (signupRequiredFields.some(field => !form[field].trim())) {
      return t.errorRequiredMsg
    }
    if (!isValidEmail(form.signupEmail.trim())) {
      return t.invalidEmailMsg
    }
    if (form.signupPassword.trim().length < 6) {
      return t.passwordMinMsg
    }
    if (form.signupPassword !== form.confirmPassword) {
      return t.passwordMismatchMsg
    }
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
    }

    const validationError = getValidationError()
    if (validationError) {
      setStatus('error')
      setStatusMessage(validationError)
      return
    }

    setStatus('loading')
    setStatusMessage('')

    // TODO: replace timeout simulation with real auth API integration.
    submitTimeoutRef.current = setTimeout(() => {
      setStatus('success')
      setStatusMessage(mode === 'login' ? t.loginSuccessMsg : t.signupSuccessMsg)
      setForm(prev =>
        mode === 'login'
          ? { ...prev, loginEmail: '', loginPassword: '' }
          : {
              ...prev,
              fullName: '',
              signupEmail: '',
              signupPassword: '',
              confirmPassword: '',
              rollNumber: '',
              branch: '',
              batch: '',
            }
      )
    }, 1200)
  }

  const activeEmail = mode === 'login' ? form.loginEmail : form.signupEmail
  const normalizedActiveEmail = activeEmail.trim()
  const showEmailDomainHint =
    normalizedActiveEmail && isValidEmail(normalizedActiveEmail) && !isPreferredCollegeEmail(normalizedActiveEmail)
  const isPasswordVisible = mode === 'login' ? showLoginPassword : showSignupPassword
  const passwordInputType = isPasswordVisible ? 'text' : 'password'
  const submitButtonLabel =
    status === 'loading'
      ? mode === 'login'
        ? t.loggingIn
        : t.signingUp
      : mode === 'login'
        ? t.loginBtn
        : t.signUpBtn

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
          <h1 className="login-title">{mode === 'login' ? t.loginTitle : t.signUpTitle}</h1>
          <p className="login-subtitle">{mode === 'login' ? t.loginSubtitle : t.signUpSubtitle}</p>

          <div className="login-mode-toggle" role="tablist" aria-label={t.modeToggleLabel}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`login-mode-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeChange('login')}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`login-mode-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => handleModeChange('signup')}
            >
              {t.signUpTab}
            </button>
          </div>

          {/* Alert */}
          {status === 'error' && (
            <motion.div
              className="login-alert login-alert-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <AlertCircle />
              {statusMessage}
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
              {statusMessage}
            </motion.div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="email" className="login-label">{t.collegeEmailLabel}</label>
              <input
                id="email"
                name={mode === 'login' ? 'loginEmail' : 'signupEmail'}
                type="email"
                className="login-input"
                placeholder={t.collegeEmailPlaceholder}
                autoComplete="username"
                value={mode === 'login' ? form.loginEmail : form.signupEmail}
                onChange={handleChange}
              />
              {showEmailDomainHint && <p className="login-hint">{t.preferredCollegeEmailMsg}</p>}
            </div>

            {mode === 'signup' && (
              <div className="login-field">
                <label htmlFor="fullName" className="login-label">{t.fullNameLabel}</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="login-input"
                  placeholder={t.fullNamePlaceholder}
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="password" className="login-label">{t.passwordLabel}</label>
              <div className="login-input-wrap">
                <input
                  id="password"
                  name={mode === 'login' ? 'loginPassword' : 'signupPassword'}
                  type={passwordInputType}
                  className="login-input"
                  placeholder={t.passwordPlaceholder}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={mode === 'login' ? form.loginPassword : form.signupPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() =>
                    mode === 'login'
                      ? setShowLoginPassword(v => !v)
                      : setShowSignupPassword(v => !v)
                  }
                  aria-label={
                    isPasswordVisible
                      ? t.hidePassword
                      : t.showPassword
                  }
                >
                  {isPasswordVisible ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
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
                      aria-label={showConfirmPassword ? t.hidePassword : t.showPassword}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="rollNumber" className="login-label">{t.rollNumberLabel}</label>
                  <input
                    id="rollNumber"
                    name="rollNumber"
                    type="text"
                    className="login-input"
                    placeholder={t.rollNumberPlaceholder}
                    value={form.rollNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="login-field">
                  <label htmlFor="branch" className="login-label">{t.branchLabel}</label>
                  <select
                    id="branch"
                    name="branch"
                    className="login-input"
                    value={form.branch}
                    onChange={handleChange}
                  >
                    <option value="">{t.branchPlaceholder}</option>
                    {t.branchOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="login-field">
                  <label htmlFor="batch" className="login-label">{t.batchLabel}</label>
                  <input
                    id="batch"
                    name="batch"
                    type="text"
                    className="login-input"
                    placeholder={t.batchPlaceholder}
                    value={form.batch}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="login-row login-row-end">
                <a href="#" className="login-forgot" onClick={e => e.preventDefault()}>{t.forgotPassword}</a>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={status === 'loading'}
            >
              {submitButtonLabel}
            </button>
          </form>

          <div className="login-divider" style={{ marginTop: '1.5rem' }}>
            <span>{t.needHelp}</span>
          </div>

          <p className="login-notice">
            {t.contactNotice}{' '}
            <a href="mailto:tpo@sietpanchkula.ac.in">tpo@sietpanchkula.ac.in</a>
            {' '}{t.orCall}{' '}
            <a href="tel:01722979887">0172-2979887</a>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
