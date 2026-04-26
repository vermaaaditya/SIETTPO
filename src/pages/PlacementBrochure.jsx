import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { Navbar } from '../components/navbar'

export default function PlacementBrochure() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/pdfs/placement_brochure_final_v3.pdf'
    link.download = 'SIET_Placement_Brochure_2024.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Navbar />
      <section className="coc-page-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Placement Brochure</span>
            <h2 className="section-title">Placement Brochure 2026–27</h2>
            <p className="section-subtitle">
              Bridging the Gap Between Academic Excellence and Industrial Innovation.
            </p>
            <p className="section-subtitle max-w-4xl mx-auto">
              Explore our comprehensive guide to campus recruitment, featuring batch demographics, department highlights, and the technological landscape of our institution.
            </p>
          </div>

          <div className="coc-panel coc-preview bg-surface-container-lowest border border-border shadow-lg rounded-lg p-4 md:p-6">
            <div className="coc-preview-head">
              <button
                onClick={() => navigate('/')}
                className="gradient-button inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleDownload}
                className="gradient-button inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="coc-preview-frame-wrap mt-4">
              <iframe
              src="/pdfs/placement_brochure_final_v3.pdf"
                className="coc-preview-frame"
                title="Placement Brochure PDF"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
