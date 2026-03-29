import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function MessageCard({ name, designation, photo, message }) {
  const [expanded, setExpanded] = useState(false)
  const preview = message.slice(0, 220)

  return (
    <div className="message-card">
      <div className="message-card-photo-wrapper">
        <img src={photo} alt={name} className="message-card-photo" />
      </div>
      <div className="message-card-body">
        <h3 className="message-card-name">{name}</h3>
        <p className="message-card-designation">{designation}</p>
        <p className="message-card-text">
          {expanded ? message : `${preview}…`}
        </p>
        <button
          className="message-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Read Less <ChevronUp className="message-toggle-icon" /></>
          ) : (
            <>Read More <ChevronDown className="message-toggle-icon" /></>
          )}
        </button>
      </div>
    </div>
  )
}

export function MessageSection() {
  return (
    <section id="messages" className="message-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Leadership</span>
          <h2 className="section-title">Messages from the Desk</h2>
        </div>

        <div className="message-grid">
          <MessageCard
            name="Prof. Anil Kumar"
            designation="Director-Principal, SIET Panchkula"
            photo="/placeholder-user.jpg"
            message="Our institution has continually strived to bridge the gap between academic excellence and industry expectations. The Training and Placement Cell embodies this vision by providing students with rigorous skill development, exposure to cutting-edge technologies, and meaningful interactions with leading recruiters. We take immense pride in our graduates who are making their mark across diverse sectors, and we remain firmly committed to nurturing the engineers of tomorrow with integrity, innovation, and impact."
          />
          <MessageCard
            name="Dr. Divya Singla"
            designation="TPC Coordinator, SIET Panchkula"
            photo="/placeholder-user.jpg"
            message="The Training and Placement Cell at SIET is dedicated to facilitating a seamless transition from campus to the corporate ecosystem. We organize industry guest lectures, mock interview sessions, technical bootcamps, and aptitude workshops throughout the academic year. Our partnerships with leading organizations ensure our students are not only job-ready but also equipped to lead in their respective domains. We invite recruiters to explore the exceptional potential of our student body, shaped by rigorous training and a culture of innovation."
          />
        </div>
      </div>
    </section>
  )
}
