import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { GradientButton } from '../components/ui/gradient-button'

export default function PdfViewer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pdfType = searchParams.get('type') // 'brochure' or 'guidelines'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pdfConfig = {
      brochure: {
        title: 'Recruitment Brochure',
        description: 'Download our comprehensive recruitment brochure to learn more about our placement process and opportunities.',
        pdfUrl: '/pdfs/placement_brochure_final_v3.pdf',
        filename: 'SIET_Recruitment_Brochure.pdf'
      },
      guidelines: {
        title: 'Recruitment Guidelines',
        description: 'View our detailed recruitment guidelines for companies and recruiters.',
        pdfUrl: '/pdfs/code-of-conduct.pdf',
        filename: 'SIET_Recruitment_Guidelines.pdf'
      }
  }

  const currentPdf = pdfConfig[pdfType] || pdfConfig.brochure

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentPdf.pdfUrl
    link.download = currentPdf.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenNew = () => {
    window.open(currentPdf.pdfUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <header className="bg-ink border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-parchment hover:text-gold transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <GradientButton onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download PDF
              </GradientButton>
              <GradientButton variant="variant" onClick={handleOpenNew}>
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </GradientButton>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Content Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-headline text-foreground mb-2">
            {currentPdf.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {currentPdf.description}
          </p>
        </div>

        {/* PDF Embed Container */}
        <div className="bg-surface-container-lowest border border-border shadow-lg rounded-lg overflow-hidden">
          <div className="bg-surface-container-low flex items-center justify-center" style={{ minHeight: '85vh' }}>
            <div className="text-center p-8 w-full h-full">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold bg-opacity-10 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl font-headline text-foreground mb-6">
                PDF Preview
              </h2>
              <iframe
                src={currentPdf.pdfUrl}
                className="w-full border-0"
                style={{ height: '85vh' }}
                title={currentPdf.title}
              />
              <div className="flex gap-3 justify-center">
                <GradientButton onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download PDF
                </GradientButton>
                <GradientButton variant="variant" onClick={handleOpenNew}>
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
