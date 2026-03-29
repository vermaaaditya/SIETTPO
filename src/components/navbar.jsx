import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#messages' },
  { label: 'Why SIET', href: '#why-recruit' },
  { label: 'Batch 2025', href: '#batch' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="navbar">
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
            Approved by AICTE, New Delhi and Affiliated to Kurukshetra University, Kurukshetra
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
        <a href="#" className="md:hidden">
          <span className="navbar-mobile-label">Training and placement cell</span>
        </a>
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="navbar-link">
              {link.label}
            </a>
          ))}
        </div>
        <div className="navbar-buttons">
          <GradientButton className="px-5 py-2.5 text-sm">For Recruiters</GradientButton>
          <GradientButton variant="variant" className="px-5 py-2.5 text-sm">Student Login</GradientButton>
        </div>
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" style={{color:'var(--gold)'}} /> : <Menu className="h-6 w-6" style={{color:'var(--gold)'}} />}
        </button>
      </nav>
    </header>
  )
}
