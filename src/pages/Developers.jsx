import { ArrowLeft, Code, Sparkles, Server, Layout, Github, Linkedin, Mail, Heart, ShieldCheck, Terminal, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'

const developers = [
  {
    name: 'Manish',
    role: 'Full Stack Developer',
    subtitle: 'Core Portal Architecture & API Integration',
    avatar: 'M',
    color: '#3B82F6',
    bio: 'Architected end-to-end full-stack systems for the SIET TPO portal, connecting state management with Firebase Firestore, real-time authentication, and administrative controls.',
    skills: ['React', 'Firebase', 'Full-Stack Architecture', 'JavaScript (ES6+)', 'REST APIs'],
    badge: 'Full Stack Engineer'
  },
  {
    name: 'Aaditya',
    role: 'Designer & Functionality Lead',
    subtitle: 'UI/UX Design System & Frontend Workflows',
    avatar: 'A',
    color: '#C9922A',
    bio: 'Crafted the institutional design language, responsive glassmorphic UI, candidate document inspection workflow, and multi-step registration forms for a seamless user experience.',
    skills: ['UI/UX Design', 'CSS Architecture', 'Frontend Engineering', 'State Workflows', 'Design Systems'],
    badge: 'Lead Designer & Frontend Architect'
  },
  {
    name: 'Nishith',
    role: 'Backend Specialist',
    subtitle: 'Storage Infrastructure & Security',
    avatar: 'N',
    color: '#10B981',
    bio: 'Engineered server storage endpoints, PHP Hostinger document managers, Firestore security rule models, and secure document vault verification pipelines.',
    skills: ['Backend Engineering', 'PHP & Server Management', 'Firestore Security Rules', 'Storage Optimization'],
    badge: 'Backend Specialist'
  }
]

export default function Developers() {
  const navigate = useNavigate()

  return (
    <main className="page-with-navbar-offset" style={{ background: 'var(--parchment)', minHeight: '100vh', color: 'var(--ink)' }}>
      <Navbar />

      <section className="coc-page-section" style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="form-back"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--ink)', color: 'var(--parchment)', borderRadius: '4px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Back to Home
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', background: 'rgba(201,146,42,0.1)', padding: '0.4rem 0.85rem', borderRadius: '999px', border: '1px solid rgba(201,146,42,0.3)' }}>
              Official Engineering Team · SIET Panchkula
            </span>
          </div>

          {/* Hero Banner */}
          <div 
            style={{ 
              textAlign: 'center', 
              marginBottom: '3.5rem', 
              padding: '3rem 2rem', 
              background: 'var(--ink)', 
              borderRadius: '8px', 
              color: 'var(--parchment)',
              border: '1px solid rgba(201,146,42,0.3)',
              boxShadow: '0 12px 40px rgba(10,22,40,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(201,146,42,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,146,42,0.15)', color: 'var(--gold)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
              <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} /> Crafted with Pride & Passion
            </div>

            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2.5rem', margin: '0 0 0.85rem 0', fontWeight: '800', letterSpacing: '0.02em', color: '#fff' }}>
              Made by Hardworking Students of SIET with Love
            </h1>

            <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Meet the student engineers who designed, built, and deployed the official Training &amp; Placement Office (TPO) digital platform for State Institute of Engineering &amp; Technology, Panchkula.
            </p>
          </div>

          {/* Developers Profiles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {developers.map((dev) => (
              <div 
                key={dev.name}
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid rgba(10,22,40,0.08)',
                  borderRadius: '8px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(10,22,40,0.04)',
                  position: 'relative'
                }}
                className="dev-card-hover"
              >
                <div>
                  {/* Avatar & Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div 
                      style={{ 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '50%', 
                        background: 'var(--ink)', 
                        color: 'var(--gold)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '800', 
                        fontSize: '1.65rem',
                        border: '2px solid var(--gold)',
                        boxShadow: '0 4px 12px rgba(10,22,40,0.15)',
                        flexShrink: 0
                      }}
                    >
                      {dev.avatar}
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', margin: 0, color: 'var(--ink)' }}>{dev.name}</h2>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: dev.color, display: 'block', marginTop: '0.15rem' }}>{dev.role}</span>
                      <small style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', display: 'block', marginTop: '0.1rem' }}>{dev.subtitle}</small>
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-container-low)', border: '1px solid rgba(10,22,40,0.1)', padding: '0.3rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', color: 'var(--ink)' }}>
                      <Award size={13} style={{ color: 'var(--gold)' }} /> {dev.badge}
                    </span>
                  </div>

                  {/* Bio Description */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted-foreground)', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                    {dev.bio}
                  </p>
                </div>

                {/* Tech Skills Chips */}
                <div>
                  <strong style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', display: 'block', marginBottom: '0.6rem' }}>
                    Core Contributions & Stack
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {dev.skills.map((skill) => (
                      <span 
                        key={skill}
                        style={{
                          background: 'rgba(10,22,40,0.05)',
                          color: 'var(--ink)',
                          fontSize: '0.73rem',
                          fontWeight: '700',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Acknowledgement Footer */}
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--surface-container-low)', borderRadius: '6px', border: '1px solid rgba(10,22,40,0.06)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>
              State Institute of Engineering &amp; Technology, Panchkula (Govt. of Haryana)
            </p>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700' }}>
              Designed &amp; Developed for Training &amp; Placement Office (TPO)
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
