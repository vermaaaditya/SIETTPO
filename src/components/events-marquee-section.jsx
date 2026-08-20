import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { eventImages } from '../data/events'

/* ─── Lightbox Modal ─── */
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
        {/* Close button */}
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
              style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          {total > 1 && (
            <>
              <button className="lightbox-arrow lightbox-arrow-prev" onClick={prev} aria-label="Previous photo"><ChevronLeft /></button>
              <button className="lightbox-arrow lightbox-arrow-next" onClick={next} aria-label="Next photo"><ChevronRight /></button>
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
              aria-label={`Go to slide ${i + 1}`}
            >
              <img src={img.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Events Marquee Section ─── */
export function EventsMarqueeSection() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { lang } = useLanguage()
  const t = translations[lang].gallery

  const events = eventImages.map((e, i) => ({
    ...e,
    title: t.events[i]?.title || '',
    subtitle: t.events[i]?.subtitle || '',
    description: t.events[i]?.description || '',
    date: t.events[i]?.date || '',
    location: t.events[i]?.location || '',
  }))

  // Double the events array for seamless infinite marquee scrolling loop
  const doubledEvents = [...events, ...events]

  return (
    <section className="events-marquee-section">
      <div className="container">
        {/* Header with Title & Top-Right CTA Button */}
        <div className="events-marquee-header">
          <div>
            <span className="events-marquee-label">{t.sectionLabel}</span>
            <h2 className="events-marquee-title">{t.sectionTitle}</h2>
            <p className="events-marquee-subtitle">{t.sectionSubtitle}</p>
          </div>
          <Link to="/events" className="events-marquee-all-btn">
            <span>{lang === 'hi' ? 'सभी इवेंट्स देखें' : 'View all Events'}</span>
            <ArrowRight className="events-marquee-btn-icon" />
          </Link>
        </div>
      </div>

      {/* Marquee viewport container with gradient edge masks */}
      <div className="events-marquee-viewport">
        <div className="events-marquee-fade-left" />
        <div className="events-marquee-fade-right" />

        <div className="events-marquee-track animate-marquee-events">
          {doubledEvents.map((event, i) => {
            const originalIndex = i % events.length
            return (
              <div key={`${event.title}-${i}`} className="event-card events-marquee-card">
                <button
                  type="button"
                  className="event-card-image-wrap event-card-image-button"
                  onClick={() => setLightboxIndex(originalIndex)}
                  aria-label={`Open gallery for ${event.title}`}
                >
                  {event.isNew && <span className="event-card-new-badge">NEW</span>}
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
                  <button className="event-card-link" onClick={() => setLightboxIndex(originalIndex)}>
                    {t.viewGallery}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox event={events[lightboxIndex]} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
