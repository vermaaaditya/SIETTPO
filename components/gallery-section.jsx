'use client'
import { motion } from 'framer-motion'
import { ImageIcon } from 'lucide-react'

const galleryItems = [
  { label: 'Placement Drive', size: '600 x 400', span: 'sm:col-span-2 sm:row-span-2' },
  { label: 'Placement Drive 2025', size: '300 x 300', span: '' },
  { label: 'Tech Fest', size: '300 x 300', span: '' },
  { label: 'Workshop Session', size: '300 x 200', span: '' },
  { label: 'Annual Day', size: '300 x 200', span: '' },
  { label: 'Sports Meet', size: '300 x 200', span: 'sm:col-span-2' },
  { label: 'Guest Lecture', size: '300 x 300', span: '' },
  { label: 'Student Council', size: '300 x 300', span: '' },
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
              key={item.label}
              className={`group relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40 transition-all duration-300 hover:border-primary/20 hover:shadow-md ${item.span}`}
              style={{ minHeight: item.span.includes('row-span-2') ? 'auto' : '180px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className={`flex w-full flex-col items-center justify-center gap-2 py-12 text-muted-foreground/30 ${item.span.includes('row-span-2') ? 'py-24' : ''}`}>
                <ImageIcon className="h-10 w-10" strokeWidth={1} />
                <span className="text-xs font-medium">{item.size}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium text-background">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
