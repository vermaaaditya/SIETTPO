import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

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
  const hasGreeting = /\b(hi|hello|hey)\b/.test(lower)
  if (lower.includes('admission') || lower.includes('apply'))
    return 'Admissions for 2026-27 are now open! We offer B.Tech in CSE (AI & ML), CSE (Cyber Security), and Robotics. Apply through the State Counselling Portal.'
  if (lower.includes('course') || lower.includes('program'))
    return 'We offer B.Tech programs in:\n1. CSE (AI & ML)\n2. CSE (Cyber Security)\n3. Robotics & Automation'
  if (lower.includes('fee'))
    return 'Fee details are updated annually. Please contact 0172-2979887 or visit the Admissions section.'
  if (lower.includes('contact'))
    return '📍 Sector 26, Panchkula\n📞 0172-2979887\n📧 tpo@sietpanchkula.ac.in'
  if (hasGreeting)
    return 'Hello! How can I assist you with SIET Panchkula?'
  return 'Thanks for your query! For detailed information, please contact 0172-2979887 or email tpo@sietpanchkula.ac.in.'
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  window: {
    width: '360px',
    maxWidth: 'calc(100vw - 2rem)',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    border: '1px solid rgba(201,146,42,0.25)',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    background: 'var(--surface-container-lowest)',
    boxShadow: '0 20px 48px rgba(10,22,40,0.18)',
    animation: 'chatbot-fadein 0.25s ease',
  },
  header: {
    background: 'var(--ink)',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '2px solid var(--gold)',
  },
  headerAvatar: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '50%',
    background: 'rgba(201,146,42,0.15)',
    border: '1.5px solid var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontFamily: 'var(--font-headline)',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--parchment)',
    letterSpacing: '0.02em',
  },
  headerStatus: {
    fontSize: '0.65rem',
    color: 'var(--gold)',
    fontFamily: 'var(--font-body)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    marginTop: '0.1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerDot: {
    width: '0.4rem',
    height: '0.4rem',
    borderRadius: '50%',
    background: 'var(--gold)',
    display: 'inline-block',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(245,240,232,0.6)',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.18s',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    background: 'var(--surface-container-low)',
  },
  msgRow: (role) => ({
    display: 'flex',
    gap: '0.5rem',
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
    alignItems: 'flex-end',
  }),
  botAvatar: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '50%',
    background: 'var(--ink)',
    border: '1.5px solid var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: (role) => ({
    maxWidth: '80%',
    padding: '0.625rem 0.875rem',
    fontSize: '0.8rem',
    lineHeight: '1.55',
    fontFamily: 'var(--font-body)',
    borderRadius: role === 'user' ? '0.75rem 0.75rem 0.125rem 0.75rem' : '0.75rem 0.75rem 0.75rem 0.125rem',
    background: role === 'user' ? 'var(--ink)' : 'var(--surface-container-lowest)',
    color: role === 'user' ? 'var(--parchment)' : 'var(--deep-text)',
    borderLeft: role === 'bot' ? '2px solid var(--gold)' : 'none',
    boxShadow: '0 2px 8px rgba(10,22,40,0.06)',
  }),
  timestamp: (role) => ({
    fontSize: '0.6rem',
    marginTop: '0.25rem',
    textAlign: 'right',
    color: role === 'user' ? 'rgba(245,240,232,0.5)' : 'var(--muted-foreground)',
    fontFamily: 'var(--font-body)',
  }),
  typingBubble: {
    background: 'var(--surface-container-lowest)',
    borderLeft: '2px solid var(--gold)',
    padding: '0.625rem 0.875rem',
    borderRadius: '0.75rem 0.75rem 0.75rem 0.125rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    boxShadow: '0 2px 8px rgba(10,22,40,0.06)',
  },
  typingDot: {
    width: '0.45rem',
    height: '0.45rem',
    borderRadius: '50%',
    background: 'var(--gold)',
  },
  quickReplies: {
    padding: '0.5rem 1rem 0.625rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    background: 'var(--surface-container-low)',
    borderTop: '1px solid rgba(201,146,42,0.12)',
  },
  quickBtn: {
    fontSize: '0.68rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    padding: '0.3rem 0.75rem',
    borderRadius: '0.125rem',
    border: '1.5px solid var(--gold)',
    background: 'transparent',
    color: 'var(--gold)',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    transition: 'background 0.18s, color 0.18s',
  },
  inputArea: {
    padding: '0.75rem 1rem',
    borderTop: '1px solid rgba(10,22,40,0.1)',
    background: 'var(--surface-container-lowest)',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: '0.8rem',
    fontFamily: 'var(--font-body)',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.125rem',
    border: '1.5px solid rgba(10,22,40,0.12)',
    background: 'var(--surface-container-low)',
    color: 'var(--deep-text)',
    outline: 'none',
  },
  sendBtn: (disabled) => ({
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.125rem',
    background: disabled ? 'rgba(201,146,42,0.3)' : 'var(--gold)',
    border: 'none',
    color: disabled ? 'rgba(10,22,40,0.4)' : 'var(--ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.18s',
    flexShrink: 0,
  }),
  toggleBtn: {
    width: '3.25rem',
    height: '3.25rem',
    borderRadius: '50%',
    background: 'var(--ink)',
    border: '2px solid var(--gold)',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(10,22,40,0.22)',
    transition: 'transform 0.18s, box-shadow 0.18s',
  },
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
    <>
      <style>{`
        @keyframes chatbot-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chatbot-close-btn:hover { color: var(--parchment) !important; }
        .chatbot-quick-btn:hover { background: var(--gold) !important; color: var(--ink) !important; }
        .chatbot-send-btn:not(:disabled):hover { filter: brightness(0.9); }
        .chatbot-toggle-btn:hover { transform: scale(1.06); box-shadow: 0 12px 32px rgba(10,22,40,0.3); }
        .chatbot-input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 2px rgba(201,146,42,0.2); }
        .chatbot-typing-dot { animation: chatbot-bounce 1.2s infinite; }
        .chatbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes chatbot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Chat Window */}
        {isOpen && (
          <div style={styles.window}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerAvatar}>
                <Bot size={16} color="var(--gold)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.headerTitle}>SIET Assistant</div>
                <div style={styles.headerStatus}>
                  <span style={styles.headerDot} />
                  Online
                </div>
              </div>
              <button
                style={styles.closeBtn}
                className="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={styles.messages}>
              {messages.map((msg) => (
                <div key={msg.id} style={styles.msgRow(msg.role)}>
                  {msg.role === 'bot' && (
                    <div style={styles.botAvatar}>
                      <Bot size={12} color="var(--gold)" />
                    </div>
                  )}
                  <div style={styles.bubble(msg.role)}>
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                    <p style={styles.timestamp(msg.role)}>{msg.time}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={styles.msgRow('bot')}>
                  <div style={styles.botAvatar}>
                    <Bot size={12} color="var(--gold)" />
                  </div>
                  <div style={styles.typingBubble}>
                    <span style={styles.typingDot} className="chatbot-typing-dot" />
                    <span style={styles.typingDot} className="chatbot-typing-dot" />
                    <span style={styles.typingDot} className="chatbot-typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div style={styles.quickReplies}>
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    style={styles.quickBtn}
                    className="chatbot-quick-btn"
                    onClick={() => sendMessage(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} style={styles.inputArea}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={styles.input}
                className="chatbot-input"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                style={styles.sendBtn(!input.trim())}
                className="chatbot-send-btn"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button
          style={styles.toggleBtn}
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle chat"
        >
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </button>
      </div>
    </>
  )
}
