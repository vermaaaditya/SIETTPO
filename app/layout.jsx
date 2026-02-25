import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'SIET TPO | Training & Placement Office - SIET Panchkula',
  description: 'Connecting forward-thinking organizations with the next generation of engineering talent from SIET Panchkula. Explore our industry-aligned curriculum and skilled graduates.',
  keywords: ['SIET Panchkula', 'Training and Placement', 'TPO', 'Engineering College', 'Campus Recruitment'],
}

export const viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
