import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GradientButton } from './ui/gradient-button'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="hero-stat-number">
      {count}{suffix}
    </span>
  )
}

export function HeroSection() {
  const { lang } = useLanguage()
  const t = translations[lang].hero
  const navigate = useNavigate()

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="/images/siet-campus.jpg"
          alt="SIET Panchkula Campus"
          className="hero-bg-image"
        />
        <div className="hero-overlay" />
        <div className="hero-grid-texture" />
      </div>

      <div className="hero-content-centered">
        <span className="hero-label">
          {t.label}
        </span>
        <h2 className="hero-branding">{t.branding}</h2>
        <h1 className="hero-headline">
          {t.headline}
        </h1>
        <p className="hero-subtext">
          {t.subtext}
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <AnimatedCounter end={300} suffix="+" />
            <span className="hero-stat-label">{t.totalStudents}</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <AnimatedCounter end={3} />
            <span className="hero-stat-label">{t.branches}</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <AnimatedCounter end={5} suffix="+" />
            <span className="hero-stat-label">{t.yearsOfExcellence}</span>
          </div>
        </div>

        <div className="hero-buttons">
          <GradientButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>{t.forRecruiters}</GradientButton>
          <GradientButton variant="variant" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>{t.downloadBrochure}</GradientButton>
        </div>
      </div>
    </section>
  )
}
