'use client'
import Image from 'next/image'
import { GradientButton } from '@/components/ui/gradient-button'
import { DotScreenShader } from '@/components/ui/dot-shader-background'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-36 md:pt-40">
      <div className="absolute inset-0">
        <DotScreenShader dotColor="#c8d6e5" bgColor="#ffffff" dotOpacity={0.15} />
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-24">
        <motion.div
          className="flex flex-1 flex-col items-start gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground">Now Accepting Industry Partners for 2026</span>
          </div>
          <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Bridging Academic Excellence with Industry Innovation.
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Connecting forward-thinking organizations with the next generation of engineering talent from SIET Panchkula.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <GradientButton>Partner with Us</GradientButton>
            <GradientButton variant="variant">Curriculum</GradientButton>
          </div>
        </motion.div>

        <motion.div
          className="w-full lg:flex-1 order-first lg:order-last"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
            <Image
              src="/images/siet-campus.jpg"
              alt="SIET Panchkula Campus Building"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
              <p className="text-sm font-medium text-primary-foreground/90">SIET Panchkula - Shaping Next-Gen Engineers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
