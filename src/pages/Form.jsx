import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { useLanguage } from '../contexts/LanguageContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnvError } from '../lib/firebase'
import { supabase } from '../lib/supabase'

const initialFormState = {
  companyName: '',
  website: '',
  industry: '',
  companySize: '',
  contactName: '',
  designation: '',
  email: '',
  phone: '',
  role: '',
  positions: '',
  preferredBranches: [],
  requiredSkills: [],
  skillsInput: '',
  additionalInfo: '',
  consent: false,
}

const HTTP_PROTOCOL_PATTERN = /^https?:\/\//i

const BRANCH_OPTIONS = [
  {
    key: 'cse_core',
    value: 'Computer Science and Engineering (Core)',
    labels: { en: 'Computer Science & Engg (Core)', hi: 'कंप्यूटर साइंस एंड इंजीनियरिंग (कोर)' },
  },
  {
    key: 'cse_ai_ml',
    value: 'CSE (AI & ML)',
    labels: { en: 'CSE (AI & ML)', hi: 'सीएसई (एआई और एमएल)' },
  },
  {
    key: 'cse_cyber_security',
    value: 'CSE (Cyber Security)',
    labels: { en: 'CSE (Cyber Security)', hi: 'सीएसई (साइबर सुरक्षा)' },
  },
  {
    key: 'robotics_automation',
    value: 'Robotics & Automation',
    labels: { en: 'Robotics & Automation', hi: 'रोबोटिक्स एवं ऑटोमेशन' },
  },
  {
    key: 'electrical',
    value: 'Electrical Engineering',
    labels: { en: 'Electrical Engineering', hi: 'इलेक्ट्रिकल इंजीनियरिंग' },
  },
  {
    key: 'vlsi',
    value: 'Electronics Engineering (VLSI Design)',
    labels: { en: 'Electronics Engg (VLSI Design)', hi: 'इलेक्ट्रॉनिक्स (वीएलएसआई डिजाइन)' },
  },
  {
    key: 'all_branches',
    value: 'All Branches',
    labels: { en: 'All Branches', hi: 'सभी शाखाएँ' },
  },
]

function isValidEmail(value) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
}

function isValidUrl(value) {
  if (!value) return true
  try {
    const normalizedValue = HTTP_PROTOCOL_PATTERN.test(value) ? value : `https://${value}`
    const parsedUrl = new URL(normalizedValue)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizePhoneDigits(value) {
  return value.replace(/\D/g, '')
}

function isValidPhone(value) {
  const digits = normalizePhoneDigits(value)
  return digits.length >= 10 && digits.length <= 15
}

export default function Form() {
  const { lang } = useLanguage()
  const [formData, setFormData] = useState(initialFormState)
  const [status, setStatus] = useState(null) // null | 'loading' | 'error' | 'success'
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => {
      if (name === 'preferredBranches') {
        const nextBranches = checked
          ? [...prev.preferredBranches, value]
          : prev.preferredBranches.filter(branch => branch !== value)
        return { ...prev, preferredBranches: nextBranches }
      }

      if (name === 'consent') {
        return { ...prev, consent: checked }
      }

      return { ...prev, [name]: type === 'checkbox' ? checked : value }
    })

    if (status === 'error' || status === 'success') {
      setStatus(null)
      setStatusMessage('')
    }
  }

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && formData.skillsInput.trim()) {
      e.preventDefault()
      const skill = formData.skillsInput.trim().replace(/,$/, '')
      if (skill && !formData.requiredSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, skill],
          skillsInput: ''
        }))
      } else {
        setFormData(prev => ({ ...prev, skillsInput: '' }))
      }
    }
  }

  const handleAddSkillBtn = (e) => {
    e.preventDefault()
    if (formData.skillsInput.trim()) {
      const skill = formData.skillsInput.trim().replace(/,$/, '')
      if (skill && !formData.requiredSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          requiredSkills: [...prev.requiredSkills, skill],
          skillsInput: ''
        }))
      } else {
        setFormData(prev => ({ ...prev, skillsInput: '' }))
      }
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!db && !supabase) {
      setStatus('error')
      setStatusMessage(firebaseEnvError || (lang === 'hi' ? 'डेटाबेस सेवा उपलब्ध नहीं है।' : 'Database service is unavailable.'))
      return
    }

    setStatus('loading')
    setStatusMessage('')

    const emailValue = formData.email.trim()
    const websiteRaw = formData.website.trim()
    const websiteValue = websiteRaw
      ? (HTTP_PROTOCOL_PATTERN.test(websiteRaw) ? websiteRaw : `https://${websiteRaw}`)
      : ''
    const positionsRaw = String(formData.positions).trim()
    const positionsValue = Number.parseInt(positionsRaw, 10)
    const requiredTextValues = [
      formData.companyName.trim(),
      formData.industry.trim(),
      formData.contactName.trim(),
      formData.designation.trim(),
      emailValue,
      formData.phone.trim(),
      formData.role.trim(),
      positionsRaw,
    ]
    const preferredBranchKeys = formData.preferredBranches.map(branch => branch.trim()).filter(Boolean)
    const preferredBranches = preferredBranchKeys
      .map((branchKey) => BRANCH_OPTIONS.find((option) => option.key === branchKey)?.value || null)
      .filter(Boolean)

    if (requiredTextValues.some(value => !value)) {
      setStatus('error')
      setStatusMessage(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill all required fields.')
      return
    }

    if (Number.isNaN(positionsValue) || positionsValue < 1) {
      setStatus('error')
      setStatusMessage(lang === 'hi' ? 'कृपया पदों की वैध संख्या दर्ज करें।' : 'Please enter a valid number of positions.')
      return
    }

    if (!isValidEmail(emailValue)) {
      setStatus('error')
      setStatusMessage(lang === 'hi' ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email address.')
      return
    }

    if (!isValidPhone(formData.phone.trim())) {
      setStatus('error')
      setStatusMessage(
        lang === 'hi'
          ? 'कृपया 10 से 15 अंकों वाला वैध फोन नंबर दर्ज करें।'
          : 'Please enter a valid phone number with 10 to 15 digits.'
      )
      return
    }

    if (!isValidUrl(websiteRaw)) {
      setStatus('error')
      setStatusMessage(lang === 'hi' ? 'कृपया वैध वेबसाइट URL दर्ज करें।' : 'Please enter a valid website URL.')
      return
    }

    if (!formData.consent) {
      setStatus('error')
      setStatusMessage(lang === 'hi' ? 'जारी रखने के लिए सहमति आवश्यक है।' : 'Consent is required to continue.')
      return
    }

    let additionalInfoCombined = formData.additionalInfo.trim()
    if (formData.requiredSkills.length > 0) {
      const skillsText = `Required Skills / Stack: ${formData.requiredSkills.join(', ')}`
      additionalInfoCombined = additionalInfoCombined
        ? `${additionalInfoCombined}\n\n${skillsText}`
        : skillsText
    }

    const payload = {
      company_name: formData.companyName.trim(),
      companyName: formData.companyName.trim(),
      website: websiteValue || null,
      industry: formData.industry.trim(),
      company_size: formData.companySize.trim() || null,
      companySize: formData.companySize.trim() || null,
      contact_name: formData.contactName.trim(),
      contactName: formData.contactName.trim(),
      designation: formData.designation.trim(),
      email: emailValue,
      phone: formData.phone.trim(),
      job_role: formData.role.trim(),
      jobRole: formData.role.trim(),
      positions: positionsValue,
      preferred_branches: preferredBranches,
      preferredBranches: preferredBranches,
      required_skills: formData.requiredSkills,
      requiredSkills: formData.requiredSkills,
      additional_info: additionalInfoCombined || null,
      additionalInfo: additionalInfoCombined || null,
      consent: formData.consent,
      created_at: new Date().toISOString(),
    }

    const submitErrorMessage = lang === 'hi'
      ? 'फॉर्म जमा नहीं हो सका। कृपया दोबारा प्रयास करें।'
      : 'Unable to submit the form. Please try again.'

    try {
      if (db) {
        await addDoc(collection(db, 'recruitment_inquiries'), {
          ...payload,
          createdAt: serverTimestamp()
        })
      } else if (supabase) {
        await supabase.from('recruitment_inquiries').insert(payload)
      }
    } catch (err) {
      console.error('Submission error:', err)
      setStatus('error')
      setStatusMessage(submitErrorMessage)
      return
    }

    setStatus('success')
    setStatusMessage(lang === 'hi' ? 'आपका आवेदन सफलतापूर्वक जमा हो गया है।' : 'Your application has been submitted successfully.')
    setFormData(initialFormState)
  }

  const statusAlertClass = status === 'error' ? 'inquiry-alert inquiry-alert-error' : 'inquiry-alert inquiry-alert-success'

  return (
    <div className="inquiry-page">
      <Navbar />

      <main className="inquiry-main">
        {/* Hero Section */}
        <header className="inquiry-hero">
          <div className="absolute inset-0 academic-grid pointer-events-none" aria-hidden="true" />

          <div className="inquiry-container inquiry-hero-inner">
            <Link to="/" className="inquiry-back-link">
              <ArrowLeft />
              {lang === 'hi' ? 'होम पर वापस जाएँ' : 'Back to Home'}
            </Link>

            <div className="inquiry-hero-grid">
              <div>
                <span className="inquiry-eyebrow">
                  {lang === 'hi' ? 'भर्तीकर्ताओं के लिए' : 'For Recruiters'}
                </span>
                <h1 className="inquiry-title">
                  {lang === 'hi' ? 'भर्ती के लिए आवेदन करें' : 'Recruitment Inquiry Form'}
                </h1>
                <p className="inquiry-subtitle">
                  {lang === 'hi'
                    ? 'हमारे प्रतिभाशाली छात्रों को नियुक्त करने के लिए इस फॉर्म को पूरा करें। हम आपके साथ परिसर ड्राइव शेड्यूल करने और साझेदारी के अवसर तलाशने के लिए उत्सुक हैं।'
                    : 'Complete this form to initiate the recruitment process with SIET Panchkula. We look forward to connecting you with our talented students and scheduling campus drives.'
                  }
                </p>
              </div>
              <div className="inquiry-note-card">
                <div className="inquiry-note-title">
                  <span className="material-symbols-outlined inquiry-note-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                      stars
                  </span>
                  <span>{lang === 'hi' ? 'महत्वपूर्ण' : 'Important'}</span>
                </div>
                <p className="inquiry-note-copy">
                  {lang === 'hi'
                    ? 'कृपया सभी आवश्यक फ़ील्ड सटीक रूप से भरें। हमारी टीम 2-3 कार्य दिवसों के भीतर आपसे संपर्क करेगी।'
                    : 'Please fill all required fields accurately. Our team will contact you within 2-3 business days to discuss recruitment opportunities.'
                  }
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="inquiry-container inquiry-form-wrap">
          <form onSubmit={handleSubmit} className="inquiry-form-stack">
            {/* Company Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inquiry-card"
            >
              <div className="inquiry-card-head">
                <div className="inquiry-card-icon">
                  <span className="material-symbols-outlined">domain</span>
                </div>
                <h2 className="inquiry-card-title">
                  {lang === 'hi' ? 'कंपनी की जानकारी' : 'Company Information'}
                </h2>
              </div>
              <div className="inquiry-grid">
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="companyName">
                    {lang === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}
                  </label>
                  <input
                    id="companyName"
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'कंपनी का नाम दर्ज करें' : 'Enter company name'}
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="website">
                    {lang === 'hi' ? 'वेबसाइट' : 'Website'}
                  </label>
                  <input
                    id="website"
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'https://www.example.com (उदाहरण)' : 'https://www.example.com (e.g.)'}
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="industry">
                    {lang === 'hi' ? 'उद्योग क्षेत्र *' : 'Industry Sector *'}
                  </label>
                  <select
                    id="industry"
                    className="inquiry-input"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
                    <option>IT & Software</option>
                    <option>Manufacturing</option>
                    <option>Consulting</option>
                    <option>Finance</option>
                    <option>{lang === 'hi' ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="companySize">
                    {lang === 'hi' ? 'कंपनी का आकार' : 'Company Size'}
                  </label>
                  <select
                    id="companySize"
                    className="inquiry-input"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
                    <option>1-50 {lang === 'hi' ? 'कर्मचारी' : 'employees'}</option>
                    <option>51-200 {lang === 'hi' ? 'कर्मचारी' : 'employees'}</option>
                    <option>201-1000 {lang === 'hi' ? 'कर्मचारी' : 'employees'}</option>
                    <option>1000+ {lang === 'hi' ? 'कर्मचारी' : 'employees'}</option>
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Contact Person Details */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inquiry-card"
            >
              <div className="inquiry-card-head">
                <div className="inquiry-card-icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h2 className="inquiry-card-title">
                  {lang === 'hi' ? 'संपर्क व्यक्ति विवरण' : 'Contact Person Details'}
                </h2>
              </div>
              <div className="inquiry-grid">
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="contactName">
                    {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    id="contactName"
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Enter your name'}
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="designation">
                    {lang === 'hi' ? 'पदनाम *' : 'Designation *'}
                  </label>
                  <input
                    id="designation"
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'जैसे HR Manager' : 'e.g., HR Manager'}
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="email">
                    {lang === 'hi' ? 'ईमेल *' : 'Email *'}
                  </label>
                  <input
                    id="email"
                    className="inquiry-input"
                    placeholder="email@example.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="phone">
                    {lang === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                  </label>
                  <input
                    id="phone"
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? '+91 XXXXX XXXXX या अंतरराष्ट्रीय नंबर' : '+91 XXXXX XXXXX or international format'}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </motion.section>

            {/* Recruitment Requirements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inquiry-card"
            >
              <div className="inquiry-card-head">
                <div className="inquiry-card-icon">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <h2 className="inquiry-card-title">
                  {lang === 'hi' ? 'भर्ती आवश्यकताएं' : 'Recruitment Requirements'}
                </h2>
              </div>
              <div className="inquiry-card-stack">
                <div className="inquiry-grid">
                  <div className="inquiry-field">
                    <label className="inquiry-label" htmlFor="role">
                      {lang === 'hi' ? 'भूमिका/पद *' : 'Role/Position *'}
                    </label>
                    <input
                      id="role"
                      className="inquiry-input"
                      placeholder={lang === 'hi' ? 'जैसे Software Engineer' : 'e.g., Software Engineer'}
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label" htmlFor="positions">
                      {lang === 'hi' ? 'रिक्तियों की संख्या *' : 'Number of Positions *'}
                    </label>
                    <input
                      id="positions"
                      className="inquiry-input"
                      placeholder={lang === 'hi' ? 'संख्या दर्ज करें' : 'Enter number'}
                      type="number"
                      name="positions"
                      value={formData.positions}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Skills Required Section */}
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="skillsInput">
                    {lang === 'hi' ? 'आवश्यक कौशल एवं स्टैक' : 'Required Skills & Tech Stack'}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <input
                      id="skillsInput"
                      className="inquiry-input"
                      placeholder={lang === 'hi' ? 'कौशल टाइप करें और Enter या Comma दबाएं (उदा. React, Python, AWS)' : 'Type skill & press Enter or Comma (e.g. React, Python, AWS)'}
                      type="text"
                      name="skillsInput"
                      value={formData.skillsInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, skillsInput: e.target.value }))}
                      onKeyDown={handleAddSkill}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkillBtn}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0 1.25rem',
                        background: 'var(--gold)',
                        color: 'var(--ink)',
                        border: 'none',
                        borderRadius: '0.125rem',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Plus style={{ width: '1rem', height: '1rem' }} />
                      {lang === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                  </div>

                  {formData.requiredSkills.length > 0 && (
                    <div className="skill-chips" style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                      {formData.requiredSkills.map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => handleRemoveSkill(skill)}
                          title="Click to remove"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.85rem',
                            border: '1px solid rgba(201,146,42,0.4)',
                            background: 'rgba(201,146,42,0.08)',
                            color: 'var(--ink)',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>{skill}</span>
                          <X style={{ width: '0.85rem', height: '0.85rem', color: '#dc2626' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <fieldset className="inquiry-field inquiry-field-branches border-0 m-0 p-0">
                  <legend className="inquiry-label" id="preferredBranchesLabel" style={{ marginBottom: '0.6rem' }}>
                    {lang === 'hi' ? 'इच्छित शाखाएँ' : 'Preferred Branches'}
                  </legend>
                  <div className="inquiry-branch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                    {BRANCH_OPTIONS.map((branchOption) => (
                      <label 
                        key={branchOption.key} 
                        className="inquiry-branch-option" 
                        htmlFor={`preferredBranch-${branchOption.key}`}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '4px',
                          border: formData.preferredBranches.includes(branchOption.key) ? '1px solid var(--gold)' : '1px solid rgba(10,22,40,0.12)',
                          background: formData.preferredBranches.includes(branchOption.key) ? 'rgba(201,146,42,0.08)' : 'var(--surface-container-low)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          id={`preferredBranch-${branchOption.key}`}
                          type="checkbox"
                          name="preferredBranches"
                          value={branchOption.key}
                          aria-labelledby="preferredBranchesLabel"
                          checked={formData.preferredBranches.includes(branchOption.key)}
                          onChange={handleChange}
                        />
                        <span style={{ fontWeight: formData.preferredBranches.includes(branchOption.key) ? '700' : '500' }}>
                          {branchOption.labels[lang]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="additionalInfo">
                    {lang === 'hi' ? 'अतिरिक्त जानकारी' : 'Additional Information'}
                  </label>
                  <textarea
                    id="additionalInfo"
                    className="inquiry-input inquiry-textarea"
                    placeholder={lang === 'hi' ? 'नौकरी विवरण, पात्रता मानदंड, वेतन सीमा, आदि।' : 'Job description, eligibility criteria, salary range, etc.'}
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </div>
            </motion.section>

            {/* Submission Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inquiry-submit-wrap"
            >
              <div className="inquiry-consent">
                <input
                  className="inquiry-consent-check"
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                <label className="inquiry-consent-label" htmlFor="consent">
                  {lang === 'hi'
                    ? 'मैं पुष्टि करता हूं कि प्रदान की गई जानकारी सटीक है और SIET पंचकुला के प्रशिक्षण एवं प्लेसमेंट कार्यालय को भर्ती अवसरों के लिए मुझसे संपर्क करने के लिए अधिकृत करता हूं।'
                    : 'I confirm that the information provided is accurate and authorize SIET Panchkula Training & Placement Office to contact me regarding recruitment opportunities.'
                  }
                </label>
              </div>
              <button
                className="inquiry-submit-btn"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? (lang === 'hi' ? 'जमा किया जा रहा है...' : 'Submitting...')
                  : (lang === 'hi' ? 'फॉर्म जमा करें' : 'Submit Application')
                }
              </button>
              {(status === 'error' || status === 'success') && (
                <div
                  className={statusAlertClass}
                  style={{ marginTop: '1rem', justifyContent: 'center', maxWidth: '52rem', marginInline: 'auto' }}
                >
                  {status === 'error' ? <AlertCircle /> : <CheckCircle2 />}
                  {statusMessage}
                </div>
              )}
              <p className="inquiry-submit-note">
                {lang === 'hi'
                  ? 'हम 2-3 कार्य दिवसों के भीतर आपसे संपर्क करेंगे।'
                  : 'We will contact you within 2-3 business days to discuss next steps.'
                }
              </p>
            </motion.div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
