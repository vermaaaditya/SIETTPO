'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryItems = [
  { src: '/images/gallery/EDwise9.jpeg',  label: 'EDwise Guest Lecture — Full House',  span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/gallery/EDwise4.jpeg',  label: 'Speaker Presentation',               span: '' },
  { src: '/images/gallery/EDwise8.jpeg',  label: 'EDwise Session',                     span: '' },
  { src: '/images/gallery/EDwise11.jpeg', label: 'Students Attending',                 span: '' },
  { src: '/images/gallery/EDwise3.jpeg',  label: 'Interactive Round Table Session',    span: '' },
  { src: '/images/gallery/EDwise5.jpeg',  label: 'Faculty with EDwise Team',           span: 'sm:col-span-2' },
]

export function GallerySection() {
  return (
    <section id="gallery" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Highlights
          </p>
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            TPO Events
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            A glimpse into the events, drives, and activities at SIET Panchkula.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.src}
              className={`group relative overflow-hidden rounded-xl border border-border bg-muted/40 transition-all duration-300 hover:border-primary/20 hover:shadow-md ${item.span}`}
              style={{ minHeight: item.span.includes('row-span-2') ? '360px' : '180px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium text-white">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
