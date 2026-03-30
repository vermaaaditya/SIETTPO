import { motion } from 'framer-motion'
import { ShieldCheck, Landmark, BookOpen, Cpu, Users, Dumbbell } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const icons = [ShieldCheck, Landmark, BookOpen, Cpu, Users, Dumbbell]

export function WhyRecruitSection() {
  const { lang } = useLanguage()
  const t = translations[lang].whyRecruit

  return (
    <section id="why-recruit" className="why-recruit-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">{t.sectionLabel}</span>
          <h2 className="section-title">{t.sectionTitle}</h2>
          <p className="section-subtitle">{t.sectionSubtitle}</p>
        </motion.div>

        <div className="why-recruit-grid">
          {t.cards.map((card, i) => {
            const Icon = icons[i]
            return (
              <div
                key={card.title}
                className="why-recruit-card"
              >
                <div className="why-recruit-card-icon">
                  <Icon />
                </div>
                <h3 className="why-recruit-card-title">{card.title}</h3>
                <p className="why-recruit-card-desc">{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
