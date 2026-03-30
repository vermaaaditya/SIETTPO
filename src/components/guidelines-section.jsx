import { motion } from 'framer-motion'
import { FileText, ClipboardList, UserCheck, Briefcase, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GradientButton } from './ui/gradient-button'
import { AnimatedTabs } from './ui/animated-tabs'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const stepIcons = [ClipboardList, UserCheck, Briefcase, CheckCircle]

export function GuidelinesSection() {
  const { lang } = useLanguage()
  const t = translations[lang].guidelines
  const navigate = useNavigate()

  const tabs = [
    {
      id: 'recruitment-process',
      label: t.recruitmentPdf,
      content: (
        <div className="guidelines-tab-content">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop"
            alt={t.recruitmentPdf}
            className="guidelines-tab-image"
          />
          <div className="guidelines-tab-copy">
            <p className="guidelines-tab-text">
              {t.bodyText}
            </p>
            <GradientButton onClick={() => navigate('/recruitment-process-pdf')}>
              <FileText className="guidelines-btn-icon" /> {t.recruitmentPdf}
            </GradientButton>
          </div>
        </div>
      ),
    },
    {
      id: 'tpo-guidelines',
      label: t.guidelinesPdf,
      content: (
        <div className="guidelines-tab-content">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop"
            alt={t.guidelinesPdf}
            className="guidelines-tab-image"
          />
          <div className="guidelines-tab-copy">
            <p className="guidelines-tab-text">
              {t.bodyText}
            </p>
            <GradientButton variant="secondary" onClick={() => navigate('/tpo-guidelines-pdf')}>
              <FileText className="guidelines-btn-icon" /> {t.guidelinesPdf}
            </GradientButton>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="guidelines-section">
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
        </motion.div>

        {/* 4-step timeline */}
        <motion.div
          className="guidelines-timeline"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t.steps.map((step, i) => {
            const Icon = stepIcons[i]
            return (
              <div key={step.label} className="guidelines-step">
                <div className="guidelines-step-icon">
                  <Icon />
                </div>
                <h4 className="guidelines-step-label">{step.label}</h4>
                <p className="guidelines-step-desc">{step.desc}</p>
                {i < t.steps.length - 1 && <div className="guidelines-step-connector" />}
              </div>
            )
          })}
        </motion.div>

        {/* Description & Buttons */}
        <motion.div
          className="guidelines-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedTabs tabs={tabs} className="guidelines-animated-tabs" />
        </motion.div>
      </div>
    </section>
  )
}
