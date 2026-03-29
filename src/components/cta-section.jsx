import { motion } from 'framer-motion'
import { GradientButton } from './ui/gradient-button'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function CtaSection() {
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
          Ready to hire the future?
        </h2>
        <p className="cta-description">
          Connect with our Training &amp; Placement Office to schedule a campus drive, request student profiles, or learn about partnership opportunities.
        </p>
        <div className="cta-button-wrapper">
          <a href="mailto:tpo@sietpanchkula.ac.in" className="cta-link">
            <GradientButton>Apply to Hire</GradientButton>
          </a>
          <GradientButton variant="variant" onClick={() => scrollTo('contact')}>
            Contact Us
          </GradientButton>
        </div>
      </motion.div>
    </section>
  )
}
