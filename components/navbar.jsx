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
      <div className="border-b border-border/30 bg-muted/50">
        <div className="mx-auto flex items-center justify-between px-6 py-3 lg:px-10">
          {/* SIET Logo */}
          <div className="flex shrink-0 items-center">
            <Image
              src="/images/siet-logo.png"
              alt="SIET Panchkula Logo"
              width={80}
              height={80}
              className="h-16 w-auto object-contain lg:h-20"
            />
          </div>

          {/* Center text */}
          <div className="hidden flex-1 px-6 text-center md:block">
            <p className="text-base font-medium leading-tight text-muted-foreground lg:text-lg"
             style={{ fontFamily: 'var(--font-tiro)', fontWeight: '400' }}>
              {'राज्य अभियांत्रिकी एवं प्रौद्योगिकी संस्थान, पंचकुला'}
            </p>
            <h1 className="text-xl font-extrabold leading-tight tracking-tight text-foreground lg:text-2xl"     style={{ fontFamily: 'var(--font-poppins)', fontWeight: '800' }}>
              State Institute of Engineering & Technology, Panchkula
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
              Approved by AICTE, New Delhi and Affiliated to Kurukshetra University, Kurukshetra
            </p>
          </div>

          {/* Haryana emblem placeholder */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted lg:h-20 lg:w-20">
            <span className="text-xs font-bold text-muted-foreground lg:text-sm">HRY</span>
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
            {/* Mobile college name */}
            <div className="border-b border-border pb-3">
              <p className="text-sm font-semibold text-foreground">State Institute of Engineering & Technology</p>
              <p className="text-xs text-muted-foreground">Panchkula, Haryana</p>
            </div>
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
