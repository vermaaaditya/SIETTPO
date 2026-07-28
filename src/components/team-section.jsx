import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, User } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

/* ─────────────────────────────────────────────
   TEAM DATA — From SIET-PKL/2026/536 Notice
   Dated: 02.02.2026
   ───────────────────────────────────────────── */
const tpo = {
  name: 'Dr. Divya Singla',
  email: 'tpo@sietpanchkula.ac.in',
  phone: '0172-2979887',
  image: '/images/dr-divya-singla.jpg',
}

const rolesData = [
  {
    members: [
      { name: 'Shan', year: '3rd Year', branch: 'AIML', gender: 'male', image: '/images/team/shan.jpg' },
      { name: 'Aditi', year: '3rd Year', branch: 'CS', gender: 'female', image: '/images/team/aditi.jpg' },
    ],
  },
  {
    members: [
      { name: 'Nishith', year: '2nd Year', branch: 'AIML', gender: 'male', image: '/images/team/nishith.jpg' },
      { name: 'Pranjal', year: '3rd Year', branch: 'AIML', gender: 'female', image: '/images/team/pranjal.jpg' },
    ],
  },
  {
    members: [
      { name: 'Saloni', year: '2nd Year', branch: 'AIML', gender: 'female', image: '/images/team/saloni.jpg' },
      { name: 'Aman Dhiman', year: '3rd Year', branch: 'AIML', gender: 'male', image: '/images/team/aman.jpg' },
    ],
  },
  {
    members: [
      { name: 'Aditya', year: '2nd Year', branch: 'AIML', gender: 'male', image: '/images/team/aditya.jpg' },
      { name: 'Deepender', year: '3rd Year', branch: 'CS', gender: 'male', image: '/images/team/deepender.jpg' },
    ],
  },
  {
    members: [
      { name: 'Pankaj Sharma', year: '3rd Year', branch: 'AIML', gender: 'male', image: '/images/team/pankaj.jpg' },
      { name: 'Mansi', year: '2nd Year', branch: 'CS', gender: 'female', image: '/images/team/mansi.jpg' },
    ],
  },
  {
    members: [
      { name: 'Chhavik', year: '3rd Year', branch: 'AIML', gender: 'male', image: '/images/team/chhavik.jpg' },
      { name: 'Dipti', year: '2nd Year', branch: 'AIML', gender: 'female', image: '/images/team/dipti.jpg' },
    ],
  },
  {
    members: [
      { name: 'Nancy', year: '3rd Year', branch: 'AIML', gender: 'female', image: '/images/team/nancy.jpg' },
      { name: 'Gagandeep', year: '2nd Year', branch: 'AIML', gender: 'male', image: '/images/team/gagandeep.jpg' },
      { name: 'Tanu', year: '2nd Year', branch: 'CS', gender: 'female', image: '/images/team/tanu.jpg' },
      { name: 'Sujal', year: '2nd Year', branch: 'CS', gender: 'male', image: '/images/team/sujal.jpg' },
    ],
  },
]

function MemberAvatar({ member }) {
  const [imgSrc, setImgSrc] = useState(member.image)
  const [hasError, setHasError] = useState(false)

  const fallbackSvg = member.gender === 'female' 
    ? '/images/team/avatar-female.svg' 
    : '/images/team/avatar-male.svg'

  const getInitial = (name) => {
    return name ? name.trim().charAt(0).toUpperCase() : 'M'
  }

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSvg)
    }
  }

  return (
    <div className="team-member-avatar-wrapper">
      <img
        src={imgSrc}
        alt={`Headshot photo of ${member.name}`}
        className="team-member-avatar-img"
        onError={handleImageError}
        loading="lazy"
      />
      {hasError && (
        <span className="team-member-avatar-initial" aria-hidden="true">
          {getInitial(member.name)}
        </span>
      )}
    </div>
  )
}

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
            <img src={tpo.image} alt={`Photo of ${tpo.name}, T&P Officer`} className="team-tpo-photo" />
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
                    <MemberAvatar member={m} />
                    <div className="team-member-details">
                      <span className="team-member-name">{m.name}</span>
                      <span className="team-member-tag">{m.year} · {m.branch}</span>
                    </div>
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
