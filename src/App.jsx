import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import Chatbot from './components/Chatbot'
import { HeroSection } from './components/hero-section'
import { SkillsMarquee } from './components/skills-marquee'
import { MessageSection } from './components/message-section'
import { WhyRecruitSection } from './components/why-recruit-section'
import { BatchSection } from './components/batch-section'
import { TrainingPipelineSection } from './components/training-pipeline-section'
import { GuidelinesSection } from './components/guidelines-section'
import { InfrastructureSection } from './components/infrastructure-section'
import { GallerySection } from './components/gallery-section'
import { CtaSection } from './components/cta-section'
import { TeamSection } from './components/team-section'
import { Footer } from './components/footer'
import StudentLogin from './pages/StudentLogin'
import PdfViewer from './pages/PdfViewer'
import PlacementBrochure from './pages/PlacementBrochure'
import GuidelinesViewer from './pages/GuidelinesViewer'
import Form from './pages/Form'

function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SkillsMarquee />
      <MessageSection />
      <WhyRecruitSection />
      <BatchSection />
      <TrainingPipelineSection />
      <GuidelinesSection />
      {/* <InfrastructureSection /> */}
      <GallerySection />
      <CtaSection />
      <TeamSection />
      <Footer />
      <Chatbot />
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/pdf-viewer" element={<PdfViewer />} />
      <Route path="/placement-brochure" element={<PlacementBrochure />} />
      <Route path="/guidelines" element={<GuidelinesViewer />} />
      <Route path="/inquiry-form" element={<Form />} />
    </Routes>
  )
}
