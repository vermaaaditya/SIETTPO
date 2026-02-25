import { Poppins, Tiro_Devanagari_Hindi } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins' 
})

const tiroDevanagari = Tiro_Devanagari_Hindi({ 
  subsets: ['devanagari'], 
  weight: ['400'],
  variable: '--font-tiro' 
})
export const metadata = {
  title: 'Training & Placement Office - SIET Panchkula',
  description: 'Connecting forward-thinking organizations with the next generation of engineering talent from SIET Panchkula. Explore our industry-aligned curriculum and skilled graduates.',
  keywords: ['SIET Panchkula', 'Training and Placement', 'TPO', 'Engineering College', 'Campus Recruitment'],
}

export const viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${tiroDevanagari.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
