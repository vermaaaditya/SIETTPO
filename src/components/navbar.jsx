import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { lang, toggleLang } = useLanguage()
  const t = translations[lang].navbar

  const navLinks = [
    { label: t.links[0], sectionId: '' },
    { label: t.links[1], sectionId: 'messages' },
    { label: t.links[2], sectionId: 'why-recruit' },
    { label: t.links[3], sectionId: 'batch' },
    { label: t.links[4], sectionId: 'gallery' },
    { label: t.links[5], sectionId: 'team' },
    { label: t.links[6], sectionId: 'contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigateToSection = (sectionId) => {
    const target = sectionId || 'top'

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target } })
      return
    }

    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    scrollTo(target)
  }

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="navbar-header">

                {/* LEFT LOGO — increased size, added min-width so it doesn't collapse */}
        <div className="navbar-header-left" style={{ minWidth: '90px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/siet-logo.png"
            alt="SIET Panchkula Logo"
            className="object-contain"
            style={{ height: '80px', width: 'auto', flexShrink: 0 }}
          />
        </div>

        {/* CENTER TEXT */}
        <div className="navbar-header-center">
          {/* Hindi name */}
          <p
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(0.75rem, 1.5vw, 1.1rem)',
              fontWeight: '400',
              color: 'var(--ink)',
            }}
          >
            राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान, पंचकुला
          </p>

          {/* English name — bolder, larger, tighter tracking for authority */}
          <h1
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(0.85rem, 2vw, 1.35rem)',
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
            className="mt-1 hidden sm:block"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.82rem)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            {t.affiliation}
          </p>
        </div>

        {/* RIGHT EMBLEM */}
        <div className="navbar-header-right" style={{ minWidth: '72px' }}>
          <img
            src="/images/haryana-sarkar.png"
            alt="Haryana Government Emblem"
            className="object-contain"
            style={{ height: '80px', width: 'auto', maxWidth: '80px' }}
          />
        </div>
      </div>

      {/* NAV BAR */}
      <nav className="navbar-nav">
        <button type="button" className="md:hidden" onClick={() => navigateToSection('')}>
          <span className="navbar-mobile-label">{t.mobileLabel}</span>
        </button>
        <div className="navbar-links">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="navbar-link"
              onClick={() => navigateToSection(link.sectionId)}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="navbar-buttons">
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
          <GradientButton className="px-5 py-2.5 text-sm" onClick={() => scrollTo('recruit-cta')}>{t.forRecruiters}</GradientButton>
          <GradientButton variant="variant" className="px-5 py-2.5 text-sm" onClick={() => navigate('/login')}>{t.studentLogin}</GradientButton>
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
            <button
              key={link.label}
              type="button"
              className="navbar-mobile-menu-link"
              onClick={() => {
                navigateToSection(link.sectionId)
                setMobileOpen(false)
              }}
            >
              {link.label}
            </button>
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
            <GradientButton className="w-full" onClick={() => { scrollTo('recruit-cta'); setMobileOpen(false) }}>{t.forRecruiters}</GradientButton>
            <GradientButton variant="variant" className="w-full" onClick={() => { navigate('/login'); setMobileOpen(false) }}>{t.studentLogin}</GradientButton>
          </div>
        </div>
      )}
    </header>
  )
}
