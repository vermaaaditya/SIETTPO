import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

export default function CodeOfConduct() {
  const { lang } = useLanguage()
  const t = translations[lang].codeOfConduct
  const [activeTab, setActiveTab] = useState('codeOfConduct')
  const currentPreview = useMemo(() => t.previewMap?.[activeTab] || '/pdfs/code-of-conduct.pdf', [t, activeTab])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentPreview
    link.download = currentPreview.includes('brochure') ? 'SIET_Resume_Template.pdf' : 'SIET_Code_of_Conduct.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="coc-page-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t.title}</span>
          <h2 className="section-title">{t.title}</h2>
        </div>

        <div className="coc-intro bg-surface-container-lowest border border-border shadow-lg rounded-lg p-6 md:p-10">
          {t.intro.map((paragraph) => (
            <p key={paragraph} className="coc-intro-text">{paragraph}</p>
          ))}
        </div>

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
              <h2 className="text-2xl font-headline mb-3">{t.rulesHeading}</h2>
              {t.rules.map((rule) => (
                <section key={rule.heading}>
                  <h3 className="text-xl font-headline mb-2">{rule.heading}</h3>
                  <p className="text-muted-foreground">{rule.body}</p>
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

        {activeTab !== 'codeOfConduct' && (
          <div className="coc-panel coc-preview bg-surface-container-lowest border border-border shadow-lg rounded-lg p-4 md:p-6">
            <div className="coc-preview-head">
              <h2 className="text-2xl font-headline mb-3">{t.previewTitle}</h2>
              <button
                onClick={handleDownload}
                className="gradient-button inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.downloadPdf}
              </button>
            </div>
            <div className="coc-preview-frame-wrap">
              <iframe
                src={currentPreview}
                className="coc-preview-frame"
                title={`${t.tabs.find((tab) => tab.key === activeTab)?.label || t.title} PDF`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
