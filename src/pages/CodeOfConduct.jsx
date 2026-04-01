import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

export default function CodeOfConduct() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = translations[lang].codeOfConduct
  const [activeTab, setActiveTab] = useState('codeOfConduct')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/pdfs/code-of-conduct.pdf'
    link.download = 'SIET_Code_of_Conduct.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="bg-ink border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="gradient-button inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
            <h1 className="text-2xl md:text-3xl font-headline text-parchment text-left flex-1">{t.title}</h1>
            {activeTab === 'codeOfConduct' && (
              <button
                onClick={handleDownload}
                className="gradient-button inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.downloadPdf}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="coc-tabs">
          {t.tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`coc-tab ${activeTab === tab.key ? 'coc-tab-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="coc-panel bg-surface-container-lowest border border-border shadow-lg rounded-lg p-6 md:p-10">
          {activeTab === 'codeOfConduct' && (
            <div className="space-y-6">
              {t.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-headline mb-2">{section.heading}</h2>
                  <p className="text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          )}

          {activeTab === 'declaration' && (
            <section>
              <h2 className="text-2xl font-headline mb-3">{t.declaration.title}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{t.declaration.body}</p>
            </section>
          )}

          {activeTab === 'resumeTemplate' && (
            <section>
              <h2 className="text-2xl font-headline mb-3">{t.resumeTemplate.title}</h2>
              <ul className="coc-points">
                {t.resumeTemplate.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
