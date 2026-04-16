import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

/* ─────────────────────────────────────────────
   UPDATE DATA — To add a new item, just append
   an object to the relevant array below.
   ───────────────────────────────────────────── */
const notifications = [
  { id: 'notif-1', title: 'Admission Open 2026-27', date: 'Jan 2026', isNew: true },
  { id: 'notif-2', title: 'Fee Structure B.Tech 2025', date: 'Jul 2025' },
  { id: 'notif-3', title: '12th Merit List', date: 'Aug 2025' },
  { id: 'notif-4', title: 'JEE Merit/Selection List', date: 'Aug 2025' },
]

const notices = [
  { id: 'notice-1', title: 'Notice PTM — Term I', date: 'Mar 2026' },
  { id: 'notice-2', title: 'Quiz Competition on Martyrdom Day', date: 'Mar 2026' },
  { id: 'notice-3', title: 'IIT Ropar Workshop Notice', date: 'Feb 2026' },
  { id: 'notice-4', title: 'Notice PTM — Term II', date: 'Mar 2026' },
]

const placements = [
  // Add placement drive announcements here when available.
]

/* ─── Single panel column ─── */
function PanelColumn({ badge, title, items, viewAllLabel, noUpdates, noUpdatesDesc, newBadge, accentClass }) {
  return (
    <div className={`updates-col ${accentClass}`}>
      <div className="updates-col-header">
        <span className="updates-col-badge">{badge}</span>
        <span className="updates-col-title">{title}</span>
      </div>
      <div className="updates-col-body">
        {items.length === 0 ? (
          <div className="updates-empty">
            <p className="updates-empty-title">{noUpdates}</p>
            <p className="updates-empty-desc">{noUpdatesDesc}</p>
          </div>
        ) : (
          <ul className="updates-list">
            {items.map((item) => (
              <li key={item.id} className="updates-item">
                <div className="updates-item-top">
                  <span className="updates-item-title">{item.title}</span>
                  {item.isNew && <span className="updates-item-new">{newBadge}</span>}
                </div>
                <span className="updates-item-date">{item.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="updates-col-footer">
        <button className="updates-view-all">{viewAllLabel}</button>
      </div>
    </div>
  )
}

/* ─── Updates Panel (exported) ─── */
export function UpdatesPanel() {
  const { lang } = useLanguage()
  const t = translations[lang].updatesPanel

  return (
    <section className="updates-panel-section">
      <div className="container">
        <div className="updates-panel-grid">
          <PanelColumn
            badge={t.notifications.badge}
            title={t.notifications.title}
            items={notifications}
            viewAllLabel={t.notifications.viewAll}
            noUpdates={t.noUpdates}
            noUpdatesDesc={t.noUpdatesDesc}
            newBadge={t.newBadge}
            accentClass="updates-col-green"
          />
          <PanelColumn
            badge={t.notices.badge}
            title={t.notices.title}
            items={notices}
            viewAllLabel={t.notices.viewAll}
            noUpdates={t.noUpdates}
            noUpdatesDesc={t.noUpdatesDesc}
            newBadge={t.newBadge}
            accentClass="updates-col-orange"
          />
          <PanelColumn
            badge={t.placements.badge}
            title={t.placements.title}
            items={placements}
            viewAllLabel={t.placements.viewAll}
            noUpdates={t.noUpdates}
            noUpdatesDesc={t.noUpdatesDesc}
            newBadge={t.newBadge}
            accentClass="updates-col-orange"
          />
        </div>
      </div>
    </section>
  )
}
