import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const pdfConfig = {
  '/recruitment-process-pdf': {
    title: 'Recruitment Process PDF',
    src: '/pdfs/recruitment-process.pdf',
  },
  '/tpo-guidelines-pdf': {
    title: 'TPO Guidelines PDF',
    src: '/pdfs/tpo-guidelines.pdf',
  },
}

export default function PdfEmbedPage() {
  const location = useLocation()

  const config = useMemo(
    () => pdfConfig[location.pathname] || pdfConfig['/recruitment-process-pdf'],
    [location.pathname],
  )

  return (
    <main className="pdf-page">
      <div className="container">
        <div className="pdf-page-header">
          <h1 className="pdf-page-title">{config.title}</h1>
          <p className="pdf-page-subtitle">
            Replace <code>{config.src}</code> with your final merged PDF file.
          </p>
        </div>

        <div className="pdf-embed-wrapper">
          <iframe
            src={config.src}
            title={config.title}
            className="pdf-embed"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  )
}
