import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

const branchColors = ['var(--gold)', 'var(--ink)', 'var(--charcoal)']
const branchStudents = [60, 60, 60]
const maxStudents = 60
const totalStudents = 180

const skills = [
  'Web Development', 'AI & Machine Learning', 'Data Structures & Algorithms', 'Embedded Systems',
  'Python', 'Java', 'Cloud Computing (AWS)',
  'IoT & Sensors', 'React & Frontend', 'SQL & Databases', 'C/C++',
  'Mobile App Development', 'Robotics',
  'Cybersecurity', 'UI/UX Design', 'Node.js & Backend',
]

const malePercent = 68
const femalePercent = 32

function PieChart({ studentsLabel }) {
  const r = 50
  const c = 2 * Math.PI * r
  const maleArc = (malePercent / 100) * c
  const femaleArc = (femalePercent / 100) * c

  return (
    <div className="batch-pie-wrapper">
      <svg viewBox="0 0 140 140" className="batch-pie-svg">
        {/* Female slice */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="28"
          strokeDasharray={`${femaleArc} ${c}`}
          strokeDashoffset="0"
          transform="rotate(-90 70 70)"
        />
        {/* Male slice */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="28"
          strokeDasharray={`${maleArc} ${c}`}
          strokeDashoffset={`-${femaleArc}`}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <p className="batch-pie-total-text">{totalStudents}</p>
      <p className="batch-pie-label-text">{studentsLabel}</p>
    </div>
  )
}

export function BatchSection() {
  const { lang } = useLanguage()
  const t = translations[lang].batch

  return (
    <section id="batch" className="batch-section">
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

        <div className="batch-grid-3">
          {/* Left: Branch-wise bar chart */}
          <motion.div
            className="batch-chart-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="batch-card-heading">{t.branchStrength}</h3>
            <div className="batch-bars">
              {t.branches.map((name, i) => (
                <div key={name} className="batch-bar-row">
                  <span className="batch-bar-label">{name}</span>
                  <div className="batch-bar-track">
                    <motion.div
                      className="batch-bar-fill"
                      style={{ backgroundColor: branchColors[i] }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(branchStudents[i] / maxStudents) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="batch-bar-count">{branchStudents[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Center: Pie Chart */}
          <motion.div
            className="batch-pie-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="batch-card-heading">{t.genderRatio}</h3>
            <PieChart studentsLabel={t.studentsLabel} />
            <div className="batch-pie-legend">
              <div className="batch-pie-legend-item">
                <span className="batch-pie-dot" style={{ background: 'var(--ink)' }} />
                <span>{t.male} — {malePercent}%</span>
              </div>
              <div className="batch-pie-legend-item">
                <span className="batch-pie-dot" style={{ background: 'var(--gold)' }} />
                <span>{t.female} — {femalePercent}%</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Skills cloud */}
          <motion.div
            className="batch-skills-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="batch-card-heading">{t.topSkills}</h3>
            <div className="batch-skills-cloud">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  className="batch-skill-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="batch-insights-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="batch-card-heading">{t.recruiterSnapshotTitle}</h3>
          <p className="batch-insights-lead">{t.recruiterSnapshotLead}</p>
          <div className="batch-insights-grid">
            {t.recruiterHighlights.map((item) => (
              <div key={item.title} className="batch-insight-item">
                <h4 className="batch-insight-title">{item.title}</h4>
                <p className="batch-insight-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="batch-micro-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Focused on building strong fundamentals, practical exposure, and industry-relevant skills.
        </motion.p>
      </div>
    </section>
  )
}
