import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from './components/navbar'
import Chatbot from './components/Chatbot'
import { HeroSection } from './components/hero-section'
import { SkillsMarquee } from './components/skills-marquee'
import { MessageSection } from './components/message-section'
import { WhyRecruitSection } from './components/why-recruit-section'
import { BatchSection } from './components/batch-section'
import { GallerySection } from './components/gallery-section'
import { CtaSection } from './components/cta-section'
import { TeamSection } from './components/team-section'
import { Footer } from './components/footer'
import StudentLogin from './pages/StudentLogin'
import PdfViewer from './pages/PdfViewer'
import PlacementBrochure from './pages/PlacementBrochure'
import GuidelinesViewer from './pages/GuidelinesViewer'
import Form from './pages/Form'
import CodeOfConduct from './pages/CodeOfConduct'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfileForm from './pages/StudentProfileForm'
import AdminDashboard from './pages/AdminDashboard'
import Developers from './pages/Developers'

const ADMIN_EMAIL = 'vermaaadityaff123@gmail.com'

function AdminGate() {
  const [allowed, setAllowed] = useState(null)
  const navigate = useNavigate()
  useEffect(() => onAuthStateChanged(auth, user => {
    if (user?.email?.toLowerCase() === ADMIN_EMAIL) setAllowed(true)
    else { setAllowed(false); navigate('/login', { replace: true }) }
  }), [navigate])
  if (allowed !== true) return <div className="portal-loading">Checking administrator access...</div>
  return <AdminDashboard handleLogout={() => navigate('/login')} />
}

function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const sectionId = location.state?.scrollTo
    if (!sectionId) return

    requestAnimationFrame(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
    })

    navigate('/', { replace: true, state: {} })
  }, [location.state, navigate])

  return (
    <main>
      <Navbar />
      <HeroSection />
      <SkillsMarquee />
      <MessageSection />
      <WhyRecruitSection />
      <CtaSection />
      <Footer />
      <Chatbot />
    </main>
  )
}

function EventsPage() {
  return (
    <main className="page-with-navbar-offset">
      <Navbar />
      <GallerySection />
      <Footer />
      <Chatbot />
    </main>
  )
}

function CodeOfConductPage() {
  return (
    <main className="page-with-navbar-offset">
      <Navbar />
      <CodeOfConduct />
      <Footer />
      <Chatbot />
    </main>
  )
}

function BatchPage() {
  return (
    <main className="page-with-navbar-offset">
      <Navbar />
      <BatchSection />
      <Footer />
      <Chatbot />
    </main>
  )
}

function TeamPage() {
  return (
    <main className="page-with-navbar-offset">
      <Navbar />
      <TeamSection />
      <Footer />
      <Chatbot />
    </main>
  )
}

function ContactPage() {
  return <Form />
}

function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setFade(true)
            setTimeout(onFinished, 500)
          }, 300)
          return 100
        }
        return prev + Math.floor(Math.random() * 15 + 5)
      })
    }, 120)

    return () => clearInterval(interval)
  }, [onFinished])

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--parchment)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fade ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fade ? 'none' : 'auto'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1.25rem',
          maxWidth: '320px',
          padding: '2.5rem',
          border: '1px solid rgba(10,22,40,0.08)',
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(10,22,40,0.03)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: '2px solid var(--gold)', borderLeft: '2px solid var(--gold)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '2px solid var(--gold)', borderRight: '2px solid var(--gold)' }} />

        <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/images/cleanersietlogo.png" alt="SIET Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-headline)', color: 'var(--ink)', fontWeight: '800', letterSpacing: '0.05em' }}>SIET PANCHKULA</h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '0.12em' }}>Training &amp; Placement Office</p>
        </div>

        <div 
          style={{ 
            width: '100%', 
            height: '3px', 
            background: 'rgba(10,22,40,0.06)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.5rem'
          }}
        >
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              background: 'var(--gold)', 
              transition: 'width 0.1s ease-out',
              boxShadow: '0 0 8px rgba(201,146,42,0.6)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [appLoading, setAppLoading] = useState(true)

  return (
    <>
      {appLoading && <LoadingScreen onFinished={() => setAppLoading(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
        <Route path="/batch-2025" element={<BatchPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/pdf-viewer" element={<PdfViewer />} />
        <Route path="/placement-brochure" element={<PlacementBrochure />} />
        <Route path="/guidelines" element={<GuidelinesViewer />} />
        <Route path="/inquiry-form" element={<Form />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student-form" element={<StudentProfileForm />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </>
  )
}
