import { useState, useEffect, useRef } from 'react'
import { GradientButton } from './ui/gradient-button'

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
          SIET Panchkula
        </span>
        <h2 className="hero-branding">Training &amp; Placement Cell</h2>
        <h1 className="hero-headline">
          Your Career Starts Here
        </h1>
        <p className="hero-subtext">
          Dedicated to helping SIET students land the right opportunities through skill development and direct recruiter engagement.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <AnimatedCounter end={300} suffix="+" />
            <span className="hero-stat-label">Total Students</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <AnimatedCounter end={3} />
            <span className="hero-stat-label">Branches</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <AnimatedCounter end={5} suffix="+" />
            <span className="hero-stat-label">Years of Excellence</span>
          </div>
        </div>

        <div className="hero-buttons">
          <GradientButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>For Recruiters</GradientButton>
          <GradientButton variant="variant" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Download Brochure</GradientButton>
        </div>
      </div>
    </section>
  )
}
