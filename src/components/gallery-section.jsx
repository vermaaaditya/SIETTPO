import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar, MapPin } from 'lucide-react'

/* ─────────────────────────────────────────────
   EVENT DATA — To add a new event, just append
   an object to this array. That's it.
   ───────────────────────────────────────────── */
const events = [
  {
    title: 'EDWise Overseas Education Seminar',
    subtitle: 'Overseas Education Consultants',
    description: 'India\'s leading overseas education consultants conducted a seminar on international admission processes, IELTS/GRE prep, and study-abroad scholarships for engineering students.',
    date: 'February 2026',
    location: 'Seminar Hall, SIET Panchkula',
    cat: 'Events',
    cover: '/images/gallery/EDWise/EDwise7.jpeg',
    images: [
      { src: '/images/gallery/EDWise/EDwise3.jpeg',  caption: 'Students exploring study-abroad opportunities' },
      { src: '/images/gallery/EDWise/EDwise4.jpeg',  caption: 'Speaker on international admission process' },
      { src: '/images/gallery/EDWise/EDwise5.jpeg',  caption: 'Faculty & EDWise representatives together' },
      { src: '/images/gallery/EDWise/EDwise6.jpeg',  caption: 'Panel discussion on overseas education' },
      { src: '/images/gallery/EDWise/EDwise7.jpeg',  caption: 'Full house — packed lecture hall' },
      { src: '/images/gallery/EDWise/EDwise8.jpeg',  caption: 'Group photo with EDWise representatives' },
      { src: '/images/gallery/EDWise/EDwise9.jpeg',  caption: 'Guidance on IELTS & GRE preparation' },
      { src: '/images/gallery/EDWise/EDwise10.jpeg', caption: 'Closing feedback round with attendees' },
      { src: '/images/gallery/EDWise/EDwise11.jpeg', caption: 'Certificate distribution to volunteers' },
    ],
  },
  {
    title: 'P&G Gillette Guard Safalta Program',
    subtitle: 'Expert Lecture by Gillette India',
    description: 'Procter & Gamble\'s Gillette Guard Safalta Program — an expert lecture on interview preparation, professional grooming, and corporate etiquette for final-year students.',
    date: 'March 16, 2026',
    location: 'Conference Room, SIET Panchkula',
    cat: 'Events',
    cover: '/images/gallery/PnG Gillete India/3.jpeg',
    images: [
      { src: '/images/gallery/PnG Gillete India/WhatsApp Image 2026-03-29 at 17.26.29.jpeg', caption: 'Official poster — Gillette Guard Safalta Program' },
      { src: '/images/gallery/PnG Gillete India/3.jpeg',  caption: 'Expert lecture on interview prep & grooming' },
      { src: '/images/gallery/PnG Gillete India/4.jpeg',  caption: 'Guest speaker addressing engineering students' },
      { src: '/images/gallery/PnG Gillete India/5.jpeg',  caption: 'Professional readiness workshop in action' },
      { src: '/images/gallery/PnG Gillete India/6.jpeg',  caption: 'Session on corporate etiquette' },
      { src: '/images/gallery/PnG Gillete India/WhatsApp Image 2026-03-16 at 11.49.02.jpeg', caption: 'Students with P&G branded backdrop' },
      { src: '/images/gallery/PnG Gillete India/WhatsApp Image 2026-03-16 at 11.49.03.jpeg', caption: 'Student coordinator at the event' },
    ],
  },
  {
    title: 'Campus & Infrastructure',
    subtitle: 'SIET Panchkula Facilities',
    description: 'A visual tour of SIET Panchkula\'s modern academic block, IoT research lab, central library, seminar hall, and project workshop spaces.',
    date: '',
    location: 'SIET Panchkula Campus',
    cat: 'Campus',
    cover: '/images/siet-campus.jpg',
    images: [
      { src: '/images/siet-campus.jpg',            caption: 'SIET Panchkula — Main Academic Block' },
      { src: '/images/siet-panchkula-building.jpg', caption: 'SIET Panchkula Campus' },
      { src: '/images/siet2.webp',                  caption: 'SIET Panchkula Campus Highlights' },
    ],
  },
]

const categories = ['All', 'Events', 'Campus']

/* ─── Lightbox Carousel ─── */
function Lightbox({ event, onClose }) {
  const [current, setCurrent] = useState(0)
  const total = event.images.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, next, prev])

  const slide = event.images[current]

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close"><X /></button>

        {/* Title */}
        <div className="lightbox-header">
          <h3 className="lightbox-title">{event.title}</h3>
          <span className="lightbox-counter">{current + 1} / {total}</span>
        </div>

        {/* Image */}
        <div className="lightbox-image-wrap">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.caption}
              className="lightbox-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          {total > 1 && (
            <>
              <button className="lightbox-arrow lightbox-arrow-prev" onClick={prev}><ChevronLeft /></button>
              <button className="lightbox-arrow lightbox-arrow-next" onClick={next}><ChevronRight /></button>
            </>
          )}
        </div>

        {/* Caption */}
        <p className="lightbox-caption">{slide.caption}</p>

        {/* Thumbnails */}
        <div className="lightbox-thumbs">
          {event.images.map((img, i) => (
            <button
              key={img.src}
              className={`lightbox-thumb ${current === i ? 'lightbox-thumb-active' : ''}`}
              onClick={() => setCurrent(i)}
            >
              <img src={img.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Gallery Section ─── */
export function GallerySection() {
  const [active, setActive] = useState('All')
  const [lightboxEvent, setLightboxEvent] = useState(null)

  const filtered = active === 'All' ? events : events.filter(e => e.cat === active)

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Highlights</span>
          <h2 className="section-title">Events & Gallery</h2>
          <p className="section-subtitle">
            Selected events, drives, and campus highlights from SIET Panchkula.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="gallery-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`gallery-tab ${active === cat ? 'gallery-tab-active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="event-cards-grid">
          {filtered.map((event, i) => (
            <motion.div
              key={event.title}
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="event-card-image-wrap" onClick={() => setLightboxEvent(event)}>
                <img src={event.cover} alt={event.title} className="event-card-image" />
                <div className="event-card-image-count">{event.images.length} photos</div>
              </div>
              <div className="event-card-body">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-subtitle">{event.subtitle}</p>
                <p className="event-card-desc">{event.description}</p>
                <div className="event-card-meta">
                  {event.date && (
                    <span className="event-card-meta-item">
                      <Calendar className="event-card-meta-icon" /> {event.date}
                    </span>
                  )}
                  <span className="event-card-meta-item">
                    <MapPin className="event-card-meta-icon" /> {event.location}
                  </span>
                </div>
                <button className="event-card-link" onClick={() => setLightboxEvent(event)}>
                  View Gallery →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxEvent && (
          <Lightbox event={lightboxEvent} onClose={() => setLightboxEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
