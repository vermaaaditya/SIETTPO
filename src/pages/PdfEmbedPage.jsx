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
    () => pdfConfig[location.pathname],
    [location.pathname],
  )

  if (!config) {
    return (
      <main className="pdf-page">
        <div className="container">
          <div className="pdf-page-header">
            <h1 className="pdf-page-title">PDF Not Found</h1>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pdf-page">
      <div className="container">
        <div className="pdf-page-header">
          <h1 className="pdf-page-title">{config.title}</h1>
        </div>

        <div className="pdf-embed-wrapper">
          <iframe
            src={config.src}
            title={config.title}
            className="pdf-embed"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </main>
  )
}
