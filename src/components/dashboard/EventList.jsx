import { useMemo, useState } from "react"
import { ArrowUpDown, CalendarDays, CheckCircle2, Building2, Briefcase } from "lucide-react"

const formatDate = value => { 
  const valueDate = value?.toDate ? value.toDate() : value instanceof Date ? value : value ? new Date(value) : null
  return !valueDate || Number.isNaN(valueDate.getTime()) ? "TBA" : valueDate.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) 
}

export default function EventList({ title, events, applications, onApply, branch, cgpa, past }) { 
  const [ascending, setAscending] = useState(false)
  const sorted = useMemo(() => [...events].sort((a,b) => (ascending ? 1 : -1) * (new Date(a.date) - new Date(b.date))), [events, ascending])
  
  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            {past ? "Placement History" : "Placement Opportunities"}
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>{title}</h3>
        </div>
        {past && (
          <button 
            type="button" 
            onClick={() => setAscending(!ascending)} 
            className="db-btn-next"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowUpDown size={14} /> Sort Date
          </button>
        )}
      </div>

      {past ? (
        <div className="db-table-wrapper" style={{ margin: 0, padding: 0 }}>
          <table className="db-table">
            <thead>
              <tr>
                <th className="db-th">Company</th>
                <th className="db-th">Drive Date</th>
                <th className="db-th">Outcome Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(event => (
                <tr key={event.id} className="db-tr">
                  <td className="db-td" style={{ fontWeight: '700', color: 'var(--ink)' }}>{event.company}</td>
                  <td className="db-td">{formatDate(event.date)}</td>
                  <td className="db-td">
                    <span className="db-badge badge-placed">
                      {event.outcome || "Attended"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="event-list">
          {sorted.map(event => { 
            const applied = applications.some(app => app.eventId === event.id)
            const eligible = (!event.eligibility?.branch || event.eligibility.branch.includes(branch)) && (!event.eligibility?.minCgpa || Number(cgpa) >= event.eligibility.minCgpa)
            
            return (
              <div className="event-row" key={event.id}>
                <div className="event-date">
                  <CalendarDays size={18} style={{ color: 'var(--gold)' }} />
                  {formatDate(event.date)}
                </div>
                
                <div className="event-main">
                  <strong>{event.company}</strong>
                  <span>{event.title || "Campus Placement Drive"}</span>
                  <small>
                    Eligible: {(event.eligibility?.branch || []).join(", ") || "All branches"} · Min CGPA {event.eligibility?.minCgpa || "—"}+
                  </small>
                </div>

                <div className="event-register">
                  <small>Deadline: {formatDate(event.registrationDeadline)}</small>
                  <button 
                    disabled={applied || !eligible} 
                    onClick={() => onApply(event)}
                    style={{
                      opacity: (applied || !eligible) ? 0.6 : 1,
                      cursor: (applied || !eligible) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {applied ? "✓ Applied" : eligible ? "Apply Now" : "Not Eligible"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
