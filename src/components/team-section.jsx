import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

/* ─────────────────────────────────────────────
   TEAM DATA — From SIET-PKL/2026/536 Notice
   Dated: 02.02.2026
   ───────────────────────────────────────────── */
const tpo = {
  name: 'Dr. Divya Singla',
  email: 'tpo@sietpanchkula.ac.in',
  phone: '+91 92532 89394',
}

const rolesData = [
  {
    members: [
      { name: 'Shan', year: '3rd Year', branch: 'AIML' },
      { name: 'Aditi', year: '3rd Year', branch: 'CS' },
    ],
  },
  {
    members: [
      { name: 'Nishith', year: '2nd Year', branch: 'AIML' },
      { name: 'Pranjal', year: '3rd Year', branch: 'AIML' },
    ],
  },
  {
    members: [
      { name: 'Saloni', year: '2nd Year', branch: 'AIML' },
      { name: 'Aman Dhiman', year: '3rd Year', branch: 'AIML' },
    ],
  },
  {
    members: [
      { name: 'Aditya', year: '2nd Year', branch: 'AIML' },
      { name: 'Deepender', year: '3rd Year', branch: 'CS' },
    ],
  },
  {
    members: [
      { name: 'Pankaj Sharma', year: '3rd Year', branch: 'AIML' },
      { name: 'Mansi', year: '2nd Year', branch: 'CS' },
    ],
  },
  {
    members: [
      { name: 'Chhavik', year: '3rd Year', branch: 'AIML' },
      { name: 'Dipti', year: '2nd Year', branch: 'AIML' },
    ],
  },
  {
    members: [
      { name: 'Nancy', year: '3rd Year', branch: 'AIML' },
      { name: 'Gagandeep', year: '2nd Year', branch: 'AIML' },
      { name: 'Tanu', year: '2nd Year', branch: 'CS' },
      { name: 'Sujal', year: '2nd Year', branch: 'CS' },
    ],
  },
]

export function TeamSection() {
  const { lang } = useLanguage()
  const t = translations[lang].team

  return (
    <section id="team" className="team-section">
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

        {/* TPO Card */}
        <motion.div
          className="team-tpo-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="team-tpo-photo-wrapper">
            <img src="/images/dr-divya-singla.jpg" alt="Photo of Dr. Divya Singla, TPO Head" className="team-tpo-photo" />
          </div>
          <div className="team-tpo-info">
            <h3 className="team-tpo-name">{tpo.name}</h3>
            <p className="team-tpo-role">{t.tpoRole}</p>
            <div className="team-tpo-contact">
              <a href={`mailto:${tpo.email}`} className="team-contact-link">
                <Mail className="team-icon" /> {tpo.email}
              </a>
              <a href={`tel:${tpo.phone}`} className="team-contact-link">
                <Phone className="team-icon" /> {tpo.phone}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Roles Grid */}
        <div className="team-roles-grid">
          {rolesData.map((role, i) => (
            <motion.div
              key={t.designations[i]}
              className="team-role-card"
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ 
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: i * 0.08 
              }}
            >
              <h4 className="team-role-title">{t.designations[i]}</h4>
              <div className="team-role-members">
                {role.members.map(m => (
                  <div key={m.name} className="team-member-row">
                    <span className="team-member-name">{m.name}</span>
                    <span className="team-member-detail">{m.year} · {m.branch}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
