import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

export function MessageSection() {
  const { lang } = useLanguage()
  const t = translations[lang].message

  return (
    <section id="messages" className="message-section">
      <div className="message-hero-inner">
        <div className="section-header">
          <span className="section-label">{t.sectionLabel}</span>
          <h2 className="section-title">{t.sectionTitle}</h2>
        </div>

        {t.members.map((member) => (
          <blockquote key={member.name} className="message-hero-quote">
            <span className="message-hero-deco" aria-hidden="true">&ldquo;</span>
            <div className="message-hero-photo-wrapper">
              <img src="/placeholder-user.jpg" alt={member.name} className="message-hero-photo" />
            </div>
            {(Array.isArray(member.message) ? member.message : [member.message]).map((para, i) => (
              <p key={i} className="message-hero-text">{para}</p>
            ))}
            <span className="message-hero-deco message-hero-deco--close" aria-hidden="true">&rdquo;</span>
            <footer className="message-hero-attribution">
              <span className="message-hero-name">{member.name}</span>
              <span className="message-hero-designation">{member.designation}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
