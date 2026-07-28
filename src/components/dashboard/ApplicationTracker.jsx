import { Activity, CheckCircle2 } from "lucide-react"

const stages = ["Applied", "Shortlisted", "Interview", "Result"]

export default function ApplicationTracker({ applications, events, expanded }) { 
  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            Pipeline Tracker
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>
            {applications.length ? "Drive Application Status" : "No Applications Submitted"}
          </h3>
        </div>
        <Activity style={{ width: '1.75rem', height: '1.75rem', color: 'var(--gold)' }} />
      </div>

      {applications.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map(app => (
            <div 
              key={app.id || app.eventId}
              style={{
                background: 'var(--surface-container-lowest)',
                padding: '1.25rem 1.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(10,22,40,0.08)',
                boxShadow: '0 2px 8px rgba(10,22,40,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontFamily: 'var(--font-headline)' }}>
                  {app.company || events.find(event => event.id === app.eventId)?.company || "Placement Drive"}
                </strong>
                <span className="db-badge badge-eligible">
                  Current Stage: {app.status || "Applied"}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                {stages.map((stage, index) => {
                  const isCurrent = app.status === stage
                  const isDone = stages.indexOf(app.status) >= index
                  
                  return (
                    <div 
                      key={stage}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        textAlign: 'center'
                      }}
                    >
                      <div 
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--gold)' : 'rgba(10,22,40,0.08)',
                          color: isDone ? 'var(--ink)' : 'var(--muted-foreground)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          boxShadow: isDone ? '0 0 10px rgba(201,146,42,0.3)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : index + 1}
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: isDone ? '700' : '500', color: isDone ? 'var(--ink)' : 'var(--muted-foreground)' }}>
                        {stage}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface-container-low)', borderRadius: '6px', border: '1px border-dashed rgba(10,22,40,0.1)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: 0, fontWeight: '600' }}>
            Apply to an open campus drive to begin tracking each selection stage here in real-time.
          </p>
        </div>
      )}
    </div>
  )
}
