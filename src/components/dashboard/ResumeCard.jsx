import { Download, FilePenLine, FileText, CheckCircle2 } from "lucide-react"

export default function ResumeCard({ resumeUrl }) { 
  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            Verification Record
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>Placement Resume</h3>
        </div>
        <FileText style={{ width: '1.75rem', height: '1.75rem', color: 'var(--gold)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center', background: 'var(--surface-container-low)', padding: '1.5rem', borderRadius: '6px', border: '1px solid rgba(10,22,40,0.06)' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--ink)', margin: '0 0 0.4rem 0' }}>
            {resumeUrl ? "Resume Uploaded & Active" : "SIET Official Resume Template"}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
            {resumeUrl ? "Your uploaded resume is linked to your candidate profile and ready for drive applications." : "Start with the institute-approved placement format for maximum recruiter visibility."}
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a 
              href={resumeUrl || "/pdfs/resume-template.pdf"} 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                background: 'var(--ink)',
                color: 'var(--parchment)',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Download size={15} /> {resumeUrl ? "Download Resume" : "Download Template"}
            </a>

            <a 
              href="/pdfs/resume-template.pdf" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1.1rem',
                background: 'transparent',
                color: 'var(--ink)',
                border: '1px solid rgba(10,22,40,0.2)',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FilePenLine size={15} /> Edit Template
            </a>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '6px', border: '1px border-dashed rgba(10,22,40,0.15)', textAlign: 'center' }}>
          <b style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink)', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>SIET STUDENT RESUME</b>
          <i style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted-foreground)', marginBottom: '0.85rem' }}>Professional Summary · Education · Skills · Projects</i>
          <span className="db-badge badge-placed" style={{ fontSize: '0.7rem' }}>
            <CheckCircle2 size={12} /> TPO Approved Format
          </span>
        </div>
      </div>
    </div>
  )
}
