import { Bell, Check, X } from "lucide-react"

const formatDate = value => { 
  const d = value?.toDate ? value.toDate() : value ? new Date(value) : null
  return d ? d.toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : "Recent" 
}

export default function NotificationFeed({ announcements, branch, onRead, onDismiss }) { 
  const filtered = announcements.filter(item => !item.targetBranch?.length || item.targetBranch.includes(branch))
  
  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            Official Bulletins
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>TPO Broadcasts</h3>
        </div>
        <Bell style={{ width: '1.75rem', height: '1.75rem', color: 'var(--gold)' }} />
      </div>

      {filtered.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(item => (
            <div 
              key={item.id} 
              style={{
                padding: '1rem 1.15rem',
                background: item.read ? 'var(--surface-container-lowest)' : 'rgba(201,146,42,0.06)',
                border: item.read ? '1px solid rgba(10,22,40,0.06)' : '1px solid rgba(201,146,42,0.3)',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--ink)', display: 'block', marginBottom: '0.25rem' }}>
                  {item.title}
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', margin: '0 0 0.4rem 0', lineHeight: 1.4 }}>
                  {item.body}
                </p>
                <small style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: '700' }}>
                  {formatDate(item.createdAt)}
                </small>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  title="Mark read" 
                  onClick={() => onRead(item.id)}
                  style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <Check size={16} />
                </button>
                <button 
                  title="Dismiss" 
                  onClick={() => onDismiss(item.id)}
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
          No announcements broadcasted for your branch right now.
        </p>
      )}
    </div>
  )
}
