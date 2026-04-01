import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'

export default function CodeOfConduct() {
  const navigate = useNavigate()

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
              Back
            </button>
            <h1 className="text-2xl md:text-3xl font-headline text-parchment text-left flex-1">Code of Conduct</h1>
            <button
              onClick={handleDownload}
              className="gradient-button inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-surface-container-lowest border border-border shadow-lg rounded-lg p-6 md:p-10 space-y-6">
          <section>
            <h2 className="text-2xl font-headline mb-2">Professional Conduct</h2>
            <p className="text-muted-foreground">
              Students must maintain professionalism in all interactions with recruiters, faculty, and peers during
              placement activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline mb-2">Communication & Attendance</h2>
            <p className="text-muted-foreground">
              Registered students are expected to attend all pre-placement talks, tests, interviews, and official TPO
              communications on time unless formally exempted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline mb-2">Honesty & Compliance</h2>
            <p className="text-muted-foreground">
              Any false information in resumes, forms, or interviews is strictly prohibited and may result in
              disqualification from placement processes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline mb-2">Offer Ethics</h2>
            <p className="text-muted-foreground">
              Once an offer is accepted as per institute policy, students must honor the commitment and follow all TPO
              rules regarding further participation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-headline mb-2">Discipline</h2>
            <p className="text-muted-foreground">
              Any misconduct, disruptive behavior, or violation of institutional norms during placement events can lead
              to disciplinary action.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
