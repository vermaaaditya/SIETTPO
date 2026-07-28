import { motion } from 'framer-motion'
import { Megaphone, Bell, FileText, Sparkles, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const newsItems = [
  {
    id: 'news-1',
    category: 'NOTICE',
    title: 'Training & Placement Committee constituted under Memo No. SIET-PKL/2026/536',
    date: '02.02.2026',
    isNew: true,
    icon: FileText,
  },
  {
    id: 'news-2',
    category: 'DRIVE',
    title: 'CodeQuotient Technical Workshop & Full-Stack Placement Drive Registration Open',
    date: 'Feb 2026',
    isNew: true,
    icon: Sparkles,
  },
  {
    id: 'news-3',
    category: 'CIRCULAR',
    title: 'P&G Gillette Guard Safalta Program — Interview Grooming & Corporate Etiquette',
    date: 'Mar 16, 2026',
    isNew: true,
    icon: Bell,
  },
  {
    id: 'news-4',
    category: 'SEMINAR',
    title: 'EDWise Overseas Education Seminar on International Admissions & Scholarships',
    date: 'Feb 2026',
    isNew: false,
    icon: Megaphone,
  },
  {
    id: 'news-5',
    category: 'VISIT',
    title: 'Industrial Exposure Visit to SCL Mohali Cleanroom & Semiconductor Fabrication',
    date: '2026',
    isNew: false,
    icon: FileText,
  },
  {
    id: 'news-6',
    category: 'GUEST LECTURE',
    title: 'GeeksforGeeks Coding Strategy Session by Sandeep Jain (Founder & CEO, GFG)',
    date: '2026',
    isNew: false,
    icon: Sparkles,
  },
]

const doubledNews = [...newsItems, ...newsItems]

export function NewsMarquee() {
  return (
    <div className="news-marquee-bar" aria-label="Official News and Circulars">
      <div className="news-marquee-badge">
        <Megaphone className="news-marquee-badge-icon" />
        <span>NEWS &amp; CIRCULARS</span>
      </div>

      <div className="news-marquee-viewport">
        <div className="news-marquee-fade-left" />
        <div className="news-marquee-fade-right" />
        
        <motion.div
          className="news-marquee-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 18,
              ease: 'linear',
            },
          }}
        >
          {doubledNews.map((item, index) => {
            const ItemIcon = item.icon
            return (
              <div key={`${item.id}-${index}`} className="news-ticker-item">
                <span className={`news-tag news-tag-${item.category.toLowerCase()}`}>
                  {item.category}
                </span>
                <ItemIcon className="news-item-icon" />
                <span className="news-item-title">{item.title}</span>
                <span className="news-item-date">{item.date}</span>
                {item.isNew && <span className="news-item-new-badge">NEW</span>}
                <span className="news-ticker-divider">•</span>
              </div>
            )
          })}
        </motion.div>
      </div>

      <Link to="/events" className="news-marquee-action" title="View all updates and events">
        <span>View All</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
