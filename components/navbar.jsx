'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Academics', href: '#academics' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Top banner */}
      <div className="border-b border-border/30 bg-white">
        <div className="mx-auto flex items-center justify-between px-3 py-2 sm:px-6 lg:px-10">

          {/* SIET Logo */}
          <div className="flex shrink-0 items-center">
            <Image
              src="/images/siet-logo.png"
              alt="SIET Panchkula Logo"
              width={250}
              height={250}
              className="h-12 w-auto object-contain sm:h-16 lg:h-24"
            />
          </div>

          {/* Center text — visible on ALL screen sizes */}
          <div className="flex flex-1 flex-col px-2 text-center sm:px-6">
            <p
              className="text-[10px] font-bold leading-tight text-foreground sm:text-base lg:text-xl"
              style={{ fontFamily: 'var(--font-tiro)' }}
            >
              {'राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान, पंचकुला'}
            </p>
            <h1
              className="text-[10px] font-extrabold leading-tight tracking-tight text-foreground sm:text-lg lg:text-2xl"
              style={{ fontFamily: 'var(--font-poppins)', fontWeight: '800' }}
            >
              State Institute of Engineering & Technology, Panchkula
            </h1>
            <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block lg:text-sm">
              Approved by AICTE, New Delhi and Affiliated to Kurukshetra University, Kurukshetra
            </p>
          </div>

          {/* Haryana Emblem */}
          <div className="flex shrink-0 items-center">
            <Image
              src="/images/haryana-sarkar.png"
              alt="Haryana Government Emblem"
              width={236}
              height={300}
              className="h-12 w-auto object-contain sm:h-16 lg:h-24"
              style={{ maxWidth: '75px' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="mx-auto flex items-center justify-between px-6 py-2.5 lg:px-10">
        <Link href="#" className="flex items-center gap-2 md:hidden">
          <span className="text-sm font-bold tracking-tight text-foreground">SIET TPO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <GradientButton className="min-w-0 px-5 py-2.5 text-sm">For Recruiters</GradientButton>
          <GradientButton variant="variant" className="min-w-0 px-5 py-2.5 text-sm">Student Login</GradientButton>
        </div>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <GradientButton className="w-full text-sm">For Recruiters</GradientButton>
              <GradientButton variant="variant" className="w-full text-sm">Student Login</GradientButton>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
