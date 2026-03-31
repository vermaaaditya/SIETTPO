import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GradientButton } from './ui/gradient-button'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CtaSection() {
  const { lang } = useLanguage()
  const t = translations[lang].cta

  return (
    <section id="recruit-cta" className="cta-section">
      <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="cta-title">
          {t.title}
        </h2>
        <p className="cta-description">
          {t.description}
        </p>
        <div className="cta-button-wrapper">
          <Link to="/inquiry-form" className="cta-link">
            <GradientButton>{t.applyToHire}</GradientButton>
          </Link>
          <GradientButton variant="variant" onClick={() => scrollTo('contact')}>
            {t.contactUs}
          </GradientButton>
        </div>
      </motion.div>
    </section>
  )
}
