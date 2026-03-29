import { motion } from 'framer-motion'

const branches = [
  { name: 'Computer Science & Engineering (AI & ML)', students: 60, color: 'var(--gold)' },
  { name: 'Computer Science & Engineering (Cyber Security)', students: 60, color: 'var(--ink)' },
  { name: 'Robotics & Automation', students: 60, color: 'var(--charcoal)' },
]

const maxStudents = Math.max(...branches.map(b => b.students))
const totalStudents = branches.reduce((sum, b) => sum + b.students, 0)

const skills = [
  'Web Development', 'AI / ML', 'Data Structures & Algorithms', 'Embedded Systems',
  'Python', 'Java', 'Cloud Computing (AWS)',
  'IoT & Sensors', 'React & Frontend', 'SQL & Databases', 'C / C++',
  'Mobile App Development', 'Robotics',
  'Machine Learning', 'Cybersecurity', 'UI/UX Design', 'Node.js & Backend',
]

/* Simple SVG pie chart */
const malePercent = 68
const femalePercent = 32

function PieChart() {
  const r = 50
  const c = 2 * Math.PI * r
  const maleArc = (malePercent / 100) * c
  const femaleArc = (femalePercent / 100) * c

  return (
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
      {/* Center label */}
      <text x="70" y="66" textAnchor="middle" className="batch-pie-total">{totalStudents}</text>
      <text x="70" y="82" textAnchor="middle" className="batch-pie-label">Students</text>
    </svg>
  )
}

export function BatchSection() {
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
          <span className="section-label">Current Cohort</span>
          <h2 className="section-title">Institute Demographics and skill sets</h2>
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
            <h3 className="batch-card-heading">Branch-wise Strength</h3>
            <div className="batch-bars">
              {branches.map((branch, i) => (
                <div key={branch.name} className="batch-bar-row">
                  <span className="batch-bar-label">{branch.name}</span>
                  <div className="batch-bar-track">
                    <motion.div
                      className="batch-bar-fill"
                      style={{ backgroundColor: branch.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(branch.students / maxStudents) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="batch-bar-count">{branch.students}</span>
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
            <h3 className="batch-card-heading">Gender Ratio</h3>
            <PieChart />
            <div className="batch-pie-legend">
              <div className="batch-pie-legend-item">
                <span className="batch-pie-dot" style={{ background: 'var(--ink)' }} />
                <span>Male — {malePercent}%</span>
              </div>
              <div className="batch-pie-legend-item">
                <span className="batch-pie-dot" style={{ background: 'var(--gold)' }} />
                <span>Female — {femalePercent}%</span>
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
            <h3 className="batch-card-heading">Top Skills Across the Batch</h3>
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
      </div>
    </section>
  )
}
