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
      // PDF will be uploaded later, using placeholder for now
      pdfUrl: '/pdfs/recruitment-brochure.pdf',
      filename: 'SIET_Recruitment_Brochure.pdf'
    },
    guidelines: {
      title: 'Recruitment Guidelines',
      description: 'View our detailed recruitment guidelines for companies and recruiters.',
      pdfUrl: '/pdfs/recruitment-guidelines.pdf',
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
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-parchment hover:text-gold transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
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
          <div className="aspect-[8.5/11] bg-surface-container-low flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold bg-opacity-10 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl font-headline text-foreground mb-2">
                PDF Preview
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                The PDF will be displayed here once uploaded to <code className="px-1 py-0.5 bg-surface-container rounded text-xs">/public/pdfs/</code> directory.
              </p>
              {/* This iframe will display the PDF once it's uploaded */}
              <iframe
                src={currentPdf.pdfUrl}
                className="w-full h-[70vh] border-0 hidden"
                title={currentPdf.title}
                onLoad={(e) => e.target.classList.remove('hidden')}
                onError={(e) => {
                  e.target.classList.add('hidden')
                }}
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

        {/* Instructions for uploading PDFs */}
        <div className="mt-8 p-6 bg-surface-container-low border border-border rounded-lg">
          <h3 className="text-lg font-headline text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            How to Upload PDFs
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Create a <code className="px-1 py-0.5 bg-surface-container rounded text-xs">/public/pdfs/</code> directory in your project if it doesn't exist</li>
            <li>Add your PDF files:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li><code className="px-1 py-0.5 bg-surface-container rounded text-xs">recruitment-brochure.pdf</code></li>
                <li><code className="px-1 py-0.5 bg-surface-container rounded text-xs">recruitment-guidelines.pdf</code></li>
              </ul>
            </li>
            <li>The PDFs will be automatically served from the public directory</li>
            <li>Once uploaded, the preview will display automatically</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
