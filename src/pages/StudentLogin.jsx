import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  Award,
  FileText,
  Linkedin,
  Github,
  Cpu
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { supabase, supabaseEnvError } from '../lib/supabase'

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

const initialFormState = {
  // Login fields
  loginEmail: '',
  loginPassword: '',

  // Step 1: Account Setup fields
  fullName: '',
  signupEmail: '',
  mobileNumber: '',
  signupPassword: '',
  confirmPassword: '',

  // Step 2: Academic & Professional fields
  rollNumber: '',
  course: '',
  branch: '',
  passingYear: '',
  cgpa: '',
  backlogs: '',
  percentage10: '',
  percentage12: '',
  resumeLink: '',
  linkedinUrl: '',
  githubUrl: '',
  skills: '',
}

export default function StudentLogin() {
  const [mode, setMode] = useState('register') // 'login' | 'register'
  const [step, setStep] = useState(1) // 1 | 2 for registration
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [status, setStatus] = useState(null) // null | 'loading' | 'error' | 'success'
  const [statusMessage, setStatusMessage] = useState('')
  const { lang } = useLanguage()
  const t = translations[lang].login

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (status === 'error') {
      setStatus(null)
      setStatusMessage('')
    }
  }

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setStep(1)
    setErrors({})
    setStatus(null)
    setStatusMessage('')
  }

  function isValidEmail(value) {
    const email = value ? value.trim() : ''
    if (!email) return false
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  function isPreferredCollegeEmail(value) {
    const normalized = value ? value.trim().toLowerCase() : ''
    const atIndex = normalized.lastIndexOf('@')
    const domain = atIndex >= 0 ? normalized.slice(atIndex + 1) : ''
    if (!domain) return false
    if (preferredCollegeEmailDomains.length > 0) {
      return preferredCollegeEmailDomains.some(preferredDomain =>
        domain === preferredDomain || domain.endsWith(`.${preferredDomain}`)
      )
    }
    return domain.includes(preferredCollegeEmailKeyword)
  }

  // Step 1 Validation
  function validateStep1() {
    const newErrors = {}
    if (!form.fullName || !form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }

    if (!form.signupEmail || !form.signupEmail.trim()) {
      newErrors.signupEmail = 'Email is required'
    } else if (!isValidEmail(form.signupEmail)) {
      newErrors.signupEmail = 'Please enter a valid email address'
    }

    if (!form.mobileNumber || !form.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Mobile number must be a 10-digit number'
    }

    if (!form.signupPassword) {
      newErrors.signupPassword = 'Password is required'
    } else if (form.signupPassword.length < 8) {
      newErrors.signupPassword = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.signupPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 2 Validation
  function validateStep2() {
    const newErrors = {}
    if (!form.rollNumber || !form.rollNumber.trim()) {
      newErrors.rollNumber = 'University Roll Number is required'
    }
    if (!form.course) {
      newErrors.course = 'Please select a course'
    }
    if (!form.branch) {
      newErrors.branch = 'Please select a branch'
    }
    if (!form.passingYear) {
      newErrors.passingYear = 'Please select a passing year'
    }

    const cgpaVal = parseFloat(form.cgpa)
    if (!form.cgpa) {
      newErrors.cgpa = 'CGPA is required'
    } else if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      newErrors.cgpa = 'CGPA must be between 0.0 and 10.0'
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.cgpa)) {
      newErrors.cgpa = 'CGPA can have up to 2 decimal places'
    }

    if (!form.backlogs) {
      newErrors.backlogs = 'Please select active backlogs'
    }

    const p10 = parseFloat(form.percentage10)
    if (!form.percentage10) {
      newErrors.percentage10 = '10th percentage is required'
    } else if (isNaN(p10) || p10 < 0 || p10 > 100) {
      newErrors.percentage10 = '10th percentage must be between 0 and 100'
    }

    const p12 = parseFloat(form.percentage12)
    if (!form.percentage12) {
      newErrors.percentage12 = '12th/Diploma percentage is required'
    } else if (isNaN(p12) || p12 < 0 || p12 > 100) {
      newErrors.percentage12 = '12th/Diploma percentage must be between 0 and 100'
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i

    if (!form.resumeLink || !form.resumeLink.trim()) {
      newErrors.resumeLink = 'Resume link is required'
    } else if (!urlPattern.test(form.resumeLink.trim())) {
      newErrors.resumeLink = 'Please enter a valid URL'
    }

    if (form.linkedinUrl && form.linkedinUrl.trim() && !urlPattern.test(form.linkedinUrl.trim())) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL'
    }

    if (form.githubUrl && form.githubUrl.trim() && !urlPattern.test(form.githubUrl.trim())) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNextStep(e) {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
    }
  }

  function handlePrevStep(e) {
    e.preventDefault()
    setStep(1)
    setErrors({})
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!form.loginEmail || !form.loginEmail.trim()) {
      newErrors.loginEmail = 'Email is required'
    } else if (!isValidEmail(form.loginEmail)) {
      newErrors.loginEmail = 'Invalid email format'
    }
    if (!form.loginPassword) {
      newErrors.loginPassword = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!supabase) {
      setStatus('error')
      setStatusMessage(supabaseEnvError || t.supabaseConfigMissingMsg)
      return
    }

    setStatus('loading')
    setStatusMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.loginEmail.trim().toLowerCase(),
        password: form.loginPassword,
      })

      if (error) throw error

      const userId = data.user?.id
      if (!userId) throw new Error(t.authDataIncompleteMsg)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, college_email')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) throw profileError

      if (!profile) {
        // Sign out if no database profile exists
        await supabase.auth.signOut()
        setStatus('error')
        setStatusMessage(t.profileNotFoundMsg)
        return
      }

      setStatus('success')
      setStatusMessage(t.loginSuccessMsg)
      setForm(prev => ({ ...prev, loginEmail: '', loginPassword: '' }))
    } catch (error) {
      setStatus('error')
      setStatusMessage(error.message || t.genericAuthErrorMsg)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    if (!validateStep2()) return

    setStatus('loading')
    setStatusMessage('')

    const payload = {
      fullName: form.fullName.trim(),
      email: form.signupEmail.trim().toLowerCase(),
      mobileNumber: form.mobileNumber.trim(),
      password: form.signupPassword,
      rollNumber: form.rollNumber.trim(),
      course: form.course,
      branch: form.branch,
      passingYear: parseInt(form.passingYear, 10),
      cgpa: parseFloat(form.cgpa),
      backlogs: form.backlogs,
      percentage10: parseFloat(form.percentage10),
      percentage12: parseFloat(form.percentage12),
      resumeLink: form.resumeLink.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    try {
      const response = await fetch('https://your-vps-ip-or-domain/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Registration failed. Please contact the administrator.')
      }

      setStatus('success')
      setStatusMessage('Registration successful! You can now log in.')
      setForm(initialFormState)
      setStep(1)
      setMode('login')
    } catch (error) {
      setStatus('error')
      setStatusMessage(error.message || 'An error occurred during registration. Please try again.')
    }
  }

  const activeEmail = mode === 'login' ? form.loginEmail : form.signupEmail
  const showEmailDomainHint =
    activeEmail && isValidEmail(activeEmail) && !isPreferredCollegeEmail(activeEmail)

  return (
    <div className="login-page flex min-h-screen bg-[#F5F0E8] font-sans text-slate-800 antialiased">
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
          <img 
            src="/images/newlogo.jpeg" 
            alt="SIET Logo" 
            className="w-16 h-16 object-cover rounded-lg mb-6 border border-amber-500/20 shadow-lg shadow-amber-500/5" 
          />
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
      <div className="login-right flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 bg-[#F5F0E8]">
        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0.9, 0.2, 1] }}
        >
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-6 group">
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> {t.backToHome}
          </Link>

          {/* Heading */}
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">{t.eyebrow}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? t.loginTitle : 'Student Registration'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            {mode === 'login'
              ? t.loginSubtitle
              : 'Create your account in just two simple steps.'}
          </p>

          {/* Tab selector (Only visible if mode is login) */}
          {mode === 'login' && (
            <div className="grid grid-cols-2 bg-slate-200/60 border border-slate-300 p-1 rounded-lg mb-6">
              <button
                type="button"
                className={`py-2 text-sm font-semibold rounded-md transition-all ${
                  mode === 'login' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleModeChange('login')}
              >
                {t.loginTab}
              </button>
              <button
                type="button"
                className={`py-2 text-sm font-semibold rounded-md transition-all ${
                  mode === 'register' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleModeChange('register')}
              >
                {t.signUpTab}
              </button>
            </div>
          )}

          {/* Registration Progress Indicator */}
          {mode === 'register' && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                <span>Step {step} of 2</span>
                <span>{step === 1 ? 'Account Setup' : 'Academic Details'}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${step * 50}%` }}
                />
              </div>
            </div>
          )}

          {/* Alerts */}
          {status === 'error' && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-6 animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm mb-6 animate-fadeIn">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label htmlFor="loginEmail" className="text-sm font-semibold text-slate-700">College Email ID</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="loginEmail"
                    name="loginEmail"
                    type="email"
                    required
                    placeholder="name@sietpanchkula.ac.in"
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    style={{ paddingLeft: '2.5rem' }}
                    value={form.loginEmail}
                    onChange={handleChange}
                  />
                </div>
                {errors.loginEmail && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.loginEmail}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="loginPassword" className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs text-amber-600 hover:text-amber-700 font-bold transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="loginPassword"
                    name="loginPassword"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                    value={form.loginPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowLoginPassword(v => !v)}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.loginPassword && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.loginPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-6"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={step === 1 ? handleNextStep : handleRegisterSubmit} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          placeholder="John Doe"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Official Email */}
                    <div className="space-y-1">
                      <label htmlFor="signupEmail" className="text-sm font-semibold text-slate-700">Official College Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="signupEmail"
                          name="signupEmail"
                          type="email"
                          required
                          placeholder="name@sietpanchkula.ac.in"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.signupEmail}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.signupEmail && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.signupEmail}</p>
                      )}
                      {showEmailDomainHint && (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                          Use your institute email for safer access continuity.
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1">
                      <label htmlFor="mobileNumber" className="text-sm font-semibold text-slate-700">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          required
                          placeholder="9876543210"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.mobileNumber}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.mobileNumber}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label htmlFor="signupPassword" className="text-sm font-semibold text-slate-700">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="signupPassword"
                          name="signupPassword"
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          placeholder="Minimum 8 characters"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                          value={form.signupPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowSignupPassword(v => !v)}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.signupPassword && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.signupPassword}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Re-enter your password"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowConfirmPassword(v => !v)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => handleModeChange('login')}
                        className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-2.5 rounded-lg text-sm transition-all"
                      >
                        Previous Step
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {/* University Roll Number */}
                    <div className="space-y-1">
                      <label htmlFor="rollNumber" className="text-sm font-semibold text-slate-700">University Roll Number *</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="rollNumber"
                          name="rollNumber"
                          type="text"
                          required
                          placeholder="e.g. 2101901"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.rollNumber}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.rollNumber && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.rollNumber}</p>
                      )}
                    </div>

                    {/* Course */}
                    <div className="space-y-1">
                      <label htmlFor="course" className="text-sm font-semibold text-slate-700">Course *</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          id="course"
                          name="course"
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.course}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Course</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                        </select>
                      </div>
                      {errors.course && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.course}</p>
                      )}
                    </div>

                    {/* Branch */}
                    <div className="space-y-1">
                      <label htmlFor="branch" className="text-sm font-semibold text-slate-700">Branch *</label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          id="branch"
                          name="branch"
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.branch}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Branch</option>
                          <option value="CSE">CSE</option>
                          <option value="AI/ML">AI/ML</option>
                          <option value="ECE">ECE</option>
                          <option value="Civil">Civil</option>
                          <option value="Mechanical">Mechanical</option>
                        </select>
                      </div>
                      {errors.branch && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.branch}</p>
                      )}
                    </div>

                    {/* Passing Year */}
                    <div className="space-y-1">
                      <label htmlFor="passingYear" className="text-sm font-semibold text-slate-700">Passing Year *</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          id="passingYear"
                          name="passingYear"
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.passingYear}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Year</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </div>
                      {errors.passingYear && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.passingYear}</p>
                      )}
                    </div>

                    {/* CGPA */}
                    <div className="space-y-1">
                      <label htmlFor="cgpa" className="text-sm font-semibold text-slate-700">Current CGPA *</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="cgpa"
                          name="cgpa"
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 8.5"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.cgpa}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.cgpa && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.cgpa}</p>
                      )}
                    </div>

                    {/* Active Backlogs */}
                    <div className="space-y-1">
                      <label htmlFor="backlogs" className="text-sm font-semibold text-slate-700">Active Backlogs *</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select
                          id="backlogs"
                          name="backlogs"
                          required
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.backlogs}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Backlogs</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3+">3+</option>
                        </select>
                      </div>
                      {errors.backlogs && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.backlogs}</p>
                      )}
                    </div>

                    {/* Percentage 10th & 12th */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="percentage10" className="text-sm font-semibold text-slate-700">10th Percentage *</label>
                        <input
                          id="percentage10"
                          name="percentage10"
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 91.5"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          value={form.percentage10}
                          onChange={handleChange}
                        />
                        {errors.percentage10 && (
                          <p className="text-xs text-red-600 font-medium mt-1">{errors.percentage10}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="percentage12" className="text-sm font-semibold text-slate-700">12th / Diploma *</label>
                        <input
                          id="percentage12"
                          name="percentage12"
                          type="number"
                          step="0.01"
                          required
                          placeholder="e.g. 88.2"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          value={form.percentage12}
                          onChange={handleChange}
                        />
                        {errors.percentage12 && (
                          <p className="text-xs text-red-600 font-medium mt-1">{errors.percentage12}</p>
                        )}
                      </div>
                    </div>

                    {/* Resume CV Link */}
                    <div className="space-y-1">
                      <label htmlFor="resumeLink" className="text-sm font-semibold text-slate-700">Resume/CV Link *</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="resumeLink"
                          name="resumeLink"
                          type="url"
                          required
                          placeholder="https://drive.google.com/..."
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.resumeLink}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.resumeLink && (
                        <p className="text-xs text-red-600 font-medium mt-1">{errors.resumeLink}</p>
                      )}
                    </div>

                    {/* LinkedIn & GitHub */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label htmlFor="linkedinUrl" className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            id="linkedinUrl"
                            name="linkedinUrl"
                            type="url"
                            placeholder="https://linkedin.com/in/..."
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            style={{ paddingLeft: '2.5rem' }}
                            value={form.linkedinUrl}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.linkedinUrl && (
                          <p className="text-xs text-red-600 font-medium mt-1">{errors.linkedinUrl}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="githubUrl" className="text-sm font-semibold text-slate-700">GitHub URL</label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            id="githubUrl"
                            name="githubUrl"
                            type="url"
                            placeholder="https://github.com/..."
                            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            style={{ paddingLeft: '2.5rem' }}
                            value={form.githubUrl}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.githubUrl && (
                          <p className="text-xs text-red-600 font-medium mt-1">{errors.githubUrl}</p>
                        )}
                      </div>
                    </div>

                    {/* Key Technical Skills */}
                    <div className="space-y-1">
                      <label htmlFor="skills" className="text-sm font-semibold text-slate-700">Key Technical Skills</label>
                      <div className="relative">
                        <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          id="skills"
                          name="skills"
                          type="text"
                          placeholder="React, Node.js, Python (comma separated)"
                          className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                          style={{ paddingLeft: '2.5rem' }}
                          value={form.skills}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="text-slate-500 text-[10px] mt-1">Separate each skill with a comma.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-2.5 rounded-lg text-sm transition-all"
                      >
                        Previous Step
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        {status === 'loading' ? 'Submitting...' : 'Register'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}

          {/* Toggle back to login/register */}
          <div className="mt-8 text-center text-sm border-t border-slate-300 my-6 pt-6">
            <span className="text-slate-600">
              {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
            </span>{' '}
            <button
              type="button"
              className="text-amber-600 hover:text-amber-700 font-bold transition-colors ml-1 focus:outline-none"
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Register Now' : 'Back to Login'}
            </button>
          </div>

          <div className="login-divider flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 my-6">
            <div className="h-px flex-1 bg-slate-300" />
            <span>Need Help?</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <p className="login-notice text-center text-xs text-slate-500 leading-relaxed">
            Contact the TPO at{' '}
            <a href="mailto:tpo@sietpanchkula.ac.in" className="text-amber-600 hover:text-amber-700 hover:underline transition-all">
              tpo@sietpanchkula.ac.in
            </a>{' '}
            or call{' '}
            <a href="tel:01722979887" className="text-amber-600 hover:text-amber-700 hover:underline transition-all">
              0172-2979887
            </a>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
