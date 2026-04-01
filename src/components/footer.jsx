import { Mail, Phone } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const quickLinkSectionIds = ['', 'batch', 'gallery', 'contact']

export function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = translations[lang].footer

  const handleSectionClick = (sectionId) => {
    const target = sectionId || 'top'

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target } })
      return
    }

    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-col">
            <div>
              <span className="footer-logo">
                {t.institutionName}
              </span>
              <p className="footer-tagline">{t.tagline}</p>
            </div>
            <p className="footer-description">
              {t.description}
            </p>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">
              {t.quickLinks}
            </h3>
            <ul className="footer-links">
              {t.links.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => handleSectionClick(quickLinkSectionIds[i])}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">
              {t.contactTpo}
            </h3>
            <ul className="footer-contact">
              <li>
                <a href="mailto:tpo@sietpanchkula.ac.in" className="footer-contact-link">
                  <Mail className="icon" />
                  tpo@sietpanchkula.ac.in
                </a>
              </li>
              <li>
                <a href="tel:+919253289394" className="footer-contact-link">
                  <Phone className="icon" />
                  +91 92532 89394 (Dr. Divya Singla)
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">{t.findUs}</h3>
            <iframe
              className="footer-map"
              src="https://maps.google.com/maps?q=MV5J%2B9Q2%2C+Sector+26%2C+Panchkula+Extension%2C+Panchkula%2C+Haryana+134116&z=16&output=embed"
              title="SIET Panchkula Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="footer-separator">
        <p>{t.copyright}</p>
      </div>
    </footer>
  )
}
