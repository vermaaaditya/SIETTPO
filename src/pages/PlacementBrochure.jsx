import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'

export default function PlacementBrochure() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/pdfs/brochure.pdf'
    link.download = 'SIET_Placement_Brochure_2024.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Simple Header */}
      <header className="bg-ink border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="gradient-button inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-2xl md:text-3xl font-headline text-parchment text-left flex-1">Placement Brochure</h1>
            <button
              onClick={handleDownload}
              className="gradient-button inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </header>

      {/* PDF Embed */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-surface-container-lowest border border-border shadow-lg rounded-lg overflow-hidden">
          <iframe
            src="/pdfs/brochure.pdf"
            className="w-full border-0"
            style={{ height: 'calc(100vh - 140px)', minHeight: '600px' }}
            title="Placement Brochure PDF"
          />
        </div>
      </main>
    </div>
  )
}
