import { useEffect } from 'react'
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
    <main>
      <Navbar />
      <GallerySection />
      <Footer />
      <Chatbot />
    </main>
  )
}

function CodeOfConductPage() {
  return (
    <main>
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

export default function App() {
  return (
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
    </Routes>
  )
}
