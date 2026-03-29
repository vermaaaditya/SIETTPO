import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin } from 'lucide-react'

/* ─────────────────────────────────────────────
   TEAM DATA — From SIET-PKL/2026/536 Notice
   Dated: 02.02.2026
   ───────────────────────────────────────────── */
const tpo = {
  name: 'Dr. Divya Singla',
  role: 'TPC Coordinator',
  email: 'sietpkl@gmail.com',
  phone: '0172-2929871',
}

const roles = [
  {
    designation: 'Student Placement Head',
    members: [
      { name: 'Shan', year: '3rd Year', branch: 'AIML' },
      { name: 'Aditi', year: '3rd Year', branch: 'CS' },
    ],
  },
  {
    designation: 'Deputy Placement Head',
    members: [
      { name: 'Nishith', year: '2nd Year', branch: 'AIML' },
      { name: 'Pranjal', year: '3rd Year', branch: 'AIML' },
    ],
  },
  {
    designation: 'Company Relation Coordinator',
    members: [
      { name: 'Saloni', year: '2nd Year', branch: 'AIML' },
      { name: 'Aman Dhiman', year: '3rd Year', branch: 'AIML' },
    ],
  },
  {
    designation: 'Training & Skill Development',
    members: [
      { name: 'Aditya', year: '2nd Year', branch: 'AIML' },
      { name: 'Deepender', year: '3rd Year', branch: 'CS' },
    ],
  },
  {
    designation: 'Data & Documentation',
    members: [
      { name: 'Pankaj Sharma', year: '3rd Year', branch: 'AIML' },
      { name: 'Mansi', year: '2nd Year', branch: 'CS' },
    ],
  },
  {
    designation: 'PR & Communication',
    members: [
      { name: 'Chhavik', year: '3rd Year', branch: 'AIML' },
      { name: 'Dipti', year: '2nd Year', branch: 'AIML' },
    ],
  },
  {
    designation: 'Student Representatives',
    members: [
      { name: 'Nancy', year: '3rd Year', branch: 'AIML' },
      { name: 'Gagandeep', year: '2nd Year', branch: 'AIML' },
      { name: 'Tanu', year: '2nd Year', branch: 'CS' },
      { name: 'Sujal', year: '2nd Year', branch: 'CS' },
    ],
  },
]

export function TeamSection() {
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
          <span className="section-label">The People Behind It</span>
          <h2 className="section-title">Training & Placement Committee</h2>
          <p className="section-subtitle">
            Constituted under Memo No. SIET-PKL/2026/536, dated 02.02.2026
          </p>
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
            <div className="team-tpo-placeholder">TPC</div>
          </div>
          <div className="team-tpo-info">
            <h3 className="team-tpo-name">{tpo.name}</h3>
            <p className="team-tpo-role">{tpo.role}</p>
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
          {roles.map((role, i) => (
            <motion.div
              key={role.designation}
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
              <h4 className="team-role-title">{role.designation}</h4>
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
