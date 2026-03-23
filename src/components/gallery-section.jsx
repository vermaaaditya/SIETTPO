import { motion } from 'framer-motion'

const galleryItems = [
  { src: '/images/gallery/EDwise7.jpeg',  label: 'EDwise Guest Lecture — Full House',  span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/gallery/EDwise4.jpeg',  label: 'Speaker Presentation',               span: '' },
  { src: '/images/gallery/EDwise8.jpeg',  label: 'EDwise Session',                     span: '' },
  { src: '/images/gallery/EDwise11.jpeg', label: 'Students Attending',                 span: '' },
  { src: '/images/gallery/EDwise3.jpeg',  label: 'Interactive Round Table Session',    span: '' },
  { src: '/images/gallery/EDwise5.jpeg',  label: 'Dr. Divya with EDwise Team',           span: 'sm:col-span-2' },
]

export function GallerySection() {
  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="gallery-header-label">
            Highlights
          </p>
          <h2 className="gallery-title">
            Events
          </h2>
          <p className="gallery-description">
            A glimpse into the events, drives, and activities at SIET Panchkula.
          </p>
        </motion.div>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.src}
              className={`gallery-item ${item.span === 'sm:col-span-2 sm:row-span-2' ? 'gallery-item-span-2 gallery-item-row-span-2' : item.span === 'sm:col-span-2' ? 'gallery-item-span-2' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="object-cover w-full h-full"
              />
              <div>
                <p className="gallery-item-label">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
