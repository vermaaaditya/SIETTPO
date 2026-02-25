'use client'
import { motion } from 'framer-motion'
import {
  Code2,
  Cpu,
  Database,
  Globe,
  BrainCircuit,
  Terminal,
  Layers,
  Cloud,
  Cog,
  Smartphone
} from 'lucide-react'

const skills = [
  { name: 'Python', icon: Terminal },
  { name: 'Java', icon: Code2 },
  { name: 'React', icon: Globe },
  { name: 'AWS', icon: Cloud },
  { name: 'C++', icon: Layers },
  { name: 'AutoCAD', icon: Cog },
  { name: 'AI / ML', icon: BrainCircuit },
  { name: 'IoT', icon: Cpu },
  { name: 'SQL', icon: Database },
  { name: 'Mobile Dev', icon: Smartphone },
]

const doubled = [...skills, ...skills]

export function SkillsMarquee() {
  return (
    <section className="border-y border-border bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Core Competencies & Technical Stack
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
        >
          {doubled.map((skill, i) => {
            const Icon = skill.icon
            return (
              <div
                key={`${skill.name}-${i}`}
                className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-6 py-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap transition-colors group-hover:text-foreground">
                  {skill.name}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
