import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { supabase } from '../lib/supabase'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const visuallyHiddenTextStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [studentDisplayName, setStudentDisplayName] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, toggleLang } = useLanguage()
  const t = translations[lang].navbar

  const navLinks = [
    { label: t.links[0], type: 'route', value: '/' },
    { label: t.links[1], type: 'route', value: '/events' },
    { label: t.links[2], type: 'route', value: '/placement-brochure' },
    { label: t.links[3], type: 'route', value: '/code-of-conduct' },
    { label: t.links[4], type: 'route', value: '/batch-2025' },
    { label: t.links[5], type: 'route', value: '/team' },
    { label: t.links[6], type: 'route', value: '/contact-us' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setStudentDisplayName('')
      return
    }

    let active = true

    const fetchAndSetDisplayName = async (user) => {
      if (!user) {
        if (active) {
          setStudentDisplayName('')
        }
        return
      }

      let profileFullName = ''
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Unable to fetch profile name for navbar:', profileError)
      }

      if (profile?.full_name) {
        profileFullName = String(profile.full_name).trim()
      }

      // Support both full_name and fullName because older records may use either key.
      const metadata = user.user_metadata || {}
      const metadataName = String(metadata.full_name || metadata.fullName || '').trim()
      const fallbackEmailName = String(user.email || '').split('@')[0].trim()
      const nextDisplayName = profileFullName || metadataName || fallbackEmailName

      if (active) {
        setStudentDisplayName(nextDisplayName)
      }
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      await fetchAndSetDisplayName(data?.session?.user || null)
    }

    void init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void fetchAndSetDisplayName(session?.user || null)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const navigateToLink = (link) => {
    navigate(link.value)
  }

  const handleRecruiterClick = () => {
    if (location.pathname === '/') {
      scrollTo('recruit-cta')
      return
    }
    navigate('/', { state: { scrollTo: 'recruit-cta' } })
  }

  const getLinkHref = (link) => {
    return link.value
  }

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      {/* Top utility bar — language toggle pinned to right */}
      <div className="navbar-topbar">
        <div className="lang-toggle" role="group" aria-label="Language toggle">
          <button
            className={`lang-toggle-btn${lang === 'en' ? ' lang-toggle-btn-active' : ''}`}
            onClick={() => lang !== 'en' && toggleLang()}
            title="English"
          >A</button>
          <button
            className={`lang-toggle-btn${lang === 'hi' ? ' lang-toggle-btn-active' : ''}`}
            onClick={() => lang !== 'hi' && toggleLang()}
            title="हिंदी"
          >अ</button>
        </div>
      </div>

      <div className="navbar-header">

        <div className="navbar-header-left">
          <img
            src="/images/siet-logo.png"
            alt="SIET Panchkula Logo"
            className="object-contain"
          />
        </div>

        {/* CENTER TEXT */}
        <div className="navbar-header-center">
          {/* Hindi name */}
          <p
            className="navbar-header-title-hindi leading-tight"
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: '500',
              color: 'var(--ink)',
            }}
          >
            राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान, पंचकुला
          </p>

          {/* English name — bolder, larger, tighter tracking for authority */}
          <h1
            className="navbar-header-title-english leading-tight"
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: '700',
              letterSpacing: '-0.01em',
              lineHeight: '1.2',
              color: 'var(--ink)',
              textTransform: 'uppercase',
            }}
          >
            State Institute of Engineering &amp; Technology, Panchkula
          </h1>

          {/* Affiliation line */}
          <p
            className="navbar-header-affiliation mt-1 hidden sm:block"
            style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            {t.affiliation}
          </p>
        </div>

        {/* RIGHT EMBLEM */}
        <div className="navbar-header-right">
          <img
            src="/images/haryana-sarkar.png"
            alt="Haryana Government Emblem"
            className="object-contain"
          />
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="navbar-nav">
        <button type="button" className="md:hidden" onClick={() => navigate('/')}>
          <span className="navbar-mobile-label">{t.mobileLabel}</span>
        </button>
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="navbar-link"
               href={getLinkHref(link)}
               onClick={(event) => {
                 event.preventDefault()
                 navigateToLink(link)
               }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="navbar-buttons">
          <GradientButton className="px-5 py-2.5 text-sm" onClick={handleRecruiterClick}>{t.forRecruiters}</GradientButton>
          {studentDisplayName ? (
            <span
              className="px-5 py-2.5 text-sm font-semibold"
              style={{ color: 'var(--ink)' }}
              title={`${t.loggedInAs} ${studentDisplayName}`}
            >
              <span style={visuallyHiddenTextStyle}>{t.loggedInAs} </span>
              {studentDisplayName}
            </span>
          ) : (
            <GradientButton variant="variant" className="px-5 py-2.5 text-sm" onClick={() => navigate('/login')}>{t.studentLogin}</GradientButton>
          )}
        </div>
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" style={{color:'var(--gold)'}} /> : <Menu className="h-6 w-6" style={{color:'var(--gold)'}} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="navbar-mobile-menu-link"
               href={getLinkHref(link)}
               onClick={(event) => {
                 event.preventDefault()
                 navigateToLink(link)
                 setMobileOpen(false)
               }}
            >
              {link.label}
            </a>
          ))}
          <div className="navbar-mobile-menu-actions">
            <div className="lang-toggle" role="group" aria-label="Language toggle">
              <button
                className={`lang-toggle-btn${lang === 'en' ? ' lang-toggle-btn-active' : ''}`}
                onClick={() => lang !== 'en' && toggleLang()}
                title="English"
              >A</button>
              <button
                className={`lang-toggle-btn${lang === 'hi' ? ' lang-toggle-btn-active' : ''}`}
                onClick={() => lang !== 'hi' && toggleLang()}
                title="हिंदी"
              >अ</button>
            </div>
            <GradientButton className="w-full" onClick={() => { handleRecruiterClick(); setMobileOpen(false) }}>{t.forRecruiters}</GradientButton>
            {studentDisplayName ? (
              <div
                className="w-full text-center py-2.5 font-semibold"
                style={{ color: 'var(--ink)' }}
                title={`${t.loggedInAs} ${studentDisplayName}`}
              >
                <span style={visuallyHiddenTextStyle}>{t.loggedInAs} </span>
                {studentDisplayName}
              </div>
            ) : (
              <GradientButton variant="variant" className="w-full" onClick={() => { navigate('/login'); setMobileOpen(false) }}>{t.studentLogin}</GradientButton>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
