'use client'
import { GradientButton } from '@/components/ui/gradient-button'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="bg-background py-24">
      <motion.div
        className="mx-auto max-w-2xl px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ready to hire the future?
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Download our placement brochure for detailed program information, student profiles, and partnership opportunities.
        </p>
        <div className="mt-8 flex justify-center">
          <GradientButton>Download Brochure</GradientButton>
        </div>
      </motion.div>
    </section>
  )
}
