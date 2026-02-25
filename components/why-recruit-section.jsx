'use client'
import { BookOpen, FlaskConical, Users, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

const cards = [
  {
    title: 'Industry-Aligned Curriculum',
    description: 'Syllabus updated for 2026 demands, covering full-stack development, cloud infrastructure, and data science pipelines.',
    icon: BookOpen,
    span: 'md:col-span-2',
  },
  {
    title: 'Hands-on Labs',
    description: 'State-of-the-art robotics, IoT, and computing labs for practical project-based learning.',
    icon: FlaskConical,
    span: '',
  },
  {
    title: 'Soft Skills Focus',
    description: 'Leadership, communication, and teamwork training modules integrated into every semester.',
    icon: Users,
    span: '',
  },
  {
    title: 'Innovation-Driven Culture',
    description: 'Hackathons, tech fests, and startup incubation programs foster an entrepreneurial mindset from day one.',
    icon: Rocket,
    span: 'md:col-span-2',
  },
]

export function WhyRecruitSection() {
  return (
    <section id="academics" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Why SIET Panchkula
          </p>
          <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Recruit Here?
          </h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                className={`group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${card.span}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 border border-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
