import { Mail, Phone } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const quickLinkRoutes = ['/', '/events', '/code-of-conduct', '/batch-2025', '/team', '/contact-us']

export function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = translations[lang].footer

  const handleSectionClick = (route) => {
    if (route === '/') {
      if (location.pathname !== '/') {
        navigate('/')
        return
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate(route)
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
                    onClick={() => handleSectionClick(quickLinkRoutes[i])}
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
                <a href="tel:01722979887" className="footer-contact-link">
                  <Phone className="icon" />
                  0172-2979887
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
