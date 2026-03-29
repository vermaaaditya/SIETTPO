import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'bot',
    text: 'नमस्ते! 🙏 Welcome to SIET Panchkula. I\'m your virtual assistant. How can I help you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]

const QUICK_REPLIES = [
  'Admissions 2026-27',
  'Programs Offered',
  'Fee Structure',
  'Contact Info',
]

function getBotResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('admission') || lower.includes('apply')) return 'Admissions for 2026-27 are now open! We offer B.Tech in CSE (AI & ML), CSE (Cyber Security), and Robotics. Apply through the State Counselling Portal.'
  if (lower.includes('course') || lower.includes('program')) return 'We offer B.Tech programs in:\n1. CSE (AI & ML)\n2. CSE (Cyber Security)\n3. Robotics & Automation'
  if (lower.includes('fee')) return 'Fee details are updated annually. Please contact +91 1733 266333 or visit Admissions section.'
  if (lower.includes('contact')) return '📍 Sector 26, Panchkula\n📞 +91 1733 266333\n📧 info@sietpanchkula.ac.in'
  if (lower.includes('hi') || lower.includes('hello')) return 'Hello! How can I assist you with SIET Panchkula?'
  return 'Thanks for your query! For detailed information, please contact +91 1733 266333.'
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: getBotResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-accent px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-site-bg flex items-center justify-center">
              <Bot size={20} className="text-accent-dark" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">SIET Assistant</h3>
              <p className="text-emerald-300 text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                Online
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 bg-slate-50">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-sm px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-dark disabled:opacity-50 transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-2xl flex items-center justify-center hover:bg-accent-dark transition-transform hover:scale-105"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
