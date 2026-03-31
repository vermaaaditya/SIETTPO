import { motion } from 'framer-motion'
import { FileText, ClipboardList, UserCheck, Briefcase, CheckCircle } from 'lucide-react'
import { GradientButton } from './ui/gradient-button'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useNavigate } from 'react-router-dom'

const stepIcons = [ClipboardList, UserCheck, Briefcase, CheckCircle]

export function GuidelinesSection() {
  const { lang } = useLanguage()
  const t = translations[lang].guidelines
  const navigate = useNavigate()

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
          <p className="guidelines-text">{t.bodyText}</p>
          <div className="guidelines-buttons">
            <GradientButton onClick={() => navigate('/pdf-viewer?type=brochure')}>
              <FileText className="guidelines-btn-icon" /> {t.recruitmentPdf}
            </GradientButton>
            <GradientButton variant="variant" onClick={() => navigate('/pdf-viewer?type=guidelines')}>
              <FileText className="guidelines-btn-icon" /> {t.guidelinesPdf}
            </GradientButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
