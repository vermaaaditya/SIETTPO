import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { SkillsMarquee } from './components/skills-marquee'
import { MessageSection } from './components/message-section'
import { WhyRecruitSection } from './components/why-recruit-section'
import { BatchSection } from './components/batch-section'
import { TrainingPipelineSection } from './components/training-pipeline-section'
import { GuidelinesSection } from './components/guidelines-section'
import { GallerySection } from './components/gallery-section'
import { TeamSection } from './components/team-section'
import { Footer } from './components/footer'
import StudentLogin from './pages/StudentLogin'

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
      <GallerySection />
      <TeamSection />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<StudentLogin />} />
    </Routes>
  )
}
