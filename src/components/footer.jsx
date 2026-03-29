import { Mail, Phone } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'Academics', href: '#batch' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-col">
            <div>
              <span className="footer-logo">
                State Institute of Engineering & Technology, Panchkula
              </span>
              <p className="footer-tagline">Training & Placement Office</p>
            </div>
            <p className="footer-description">
              Bridging academia and industry by connecting skilled graduates with leading organizations across the country.
            </p>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">
              Quick Links
            </h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">
              Contact TPO
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
                  +91 92532 89394 (Divya Singla)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-map-section">
          <h3 className="footer-heading">Find Us</h3>
          <iframe
            className="footer-map"
            src="https://www.google.com/maps?q=State+Institute+of+Engineering+%26+Technology+Panchkula+Haryana&output=embed"
            title="SIET Panchkula Location"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="footer-separator">
          <p>
            &copy; 2026 SIET Panchkula. Training &amp; Placement Office. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
