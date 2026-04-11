import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar, MapPin } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

/* ─────────────────────────────────────────────
   EVENT DATA — To add a new event, just append
   an object to this array. That's it.
   ───────────────────────────────────────────── */
const eventImages = [
  {
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
    cat: 'Events',
    cover: '/images/gallery/gfg/gfg1.jpeg',
    images: [
      { src: '/images/gallery/gfg/gfg1.jpeg', caption: 'GFG expert lecture session underway' },
      { src: '/images/gallery/gfg/gfg2.jpeg', caption: 'Students attending the GFG session' },
      { src: '/images/gallery/gfg/gfg3.jpeg', caption: 'Hands-on guidance during the lecture' },
      { src: '/images/gallery/gfg/gfg4.jpeg', caption: 'Interactive Q&A with the expert speaker' },
      { src: '/images/gallery/gfg/gfg5.jpeg', caption: 'Group moments from the GFG event' },
    ],
  },
  {
    cat: 'POSH Seminar',
    cover: '/images/gallery/POSH seminar/posh9.jpeg',
    images: [
      { src: '/images/gallery/POSH seminar/posh1.jpeg', caption: 'Breaking the silence — awareness begins here' },
      { src: '/images/gallery/POSH seminar/posh2.jpeg', caption: 'Every voice matters — standing together against harassment' },
      { src: '/images/gallery/POSH seminar/posh3.jpeg', caption: 'Knowledge is the first step to a safer workplace' },
      { src: '/images/gallery/POSH seminar/posh4.jpeg', caption: 'Empowered minds, respectful spaces' },
      { src: '/images/gallery/POSH seminar/posh5.jpeg', caption: 'Building a culture of dignity and inclusion' },
      { src: '/images/gallery/POSH seminar/posh6.jpeg', caption: 'Your rights, your protection — know the law' },
      { src: '/images/gallery/POSH seminar/posh7.jpeg', caption: 'Together we create an environment where everyone thrives' },
      { src: '/images/gallery/POSH seminar/posh8.jpeg', caption: "Shaping tomorrow's workplace with today's awareness" },
      { src: '/images/gallery/POSH seminar/posh9.jpeg', caption: "Respect is not optional — it's the foundation" },
    ],
  },
]

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
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { lang } = useLanguage()
  const t = translations[lang].gallery

  const events = eventImages.map((e, i) => ({
    ...e,
    title: t.events[i].title,
    subtitle: t.events[i].subtitle,
    description: t.events[i].description,
    date: t.events[i].date,
    location: t.events[i].location,
  }))

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
          <span className="section-label">{t.sectionLabel}</span>
          <h2 className="section-title">{t.sectionTitle}</h2>
          <p className="section-subtitle">{t.sectionSubtitle}</p>
        </motion.div>

        <motion.div
          className="event-cards-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <button
                type="button"
                className="event-card-image-wrap event-card-image-button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open gallery for ${event.title}`}
              >
                <img src={event.cover} alt={event.title} className="event-card-image" />
                <div className="event-card-image-count">{event.images.length} {t.photosLabel}</div>
              </button>
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
                <button className="event-card-link" onClick={() => setLightboxIndex(i)}>
                  {t.viewGallery}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox event={events[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
