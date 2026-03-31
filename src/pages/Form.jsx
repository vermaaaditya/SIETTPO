import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { useLanguage } from '../contexts/LanguageContext'

export default function Form() {
  const { lang } = useLanguage()
  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="inquiry-page">
      <Navbar />

      <main className="inquiry-main">
        {/* Hero Section */}
        <header className="inquiry-hero">
          {/* Academic grid texture */}
          <div className="absolute inset-0 academic-grid pointer-events-none" aria-hidden="true" />

          <div className="inquiry-container inquiry-hero-inner">
            {/* Back link */}
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
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'कंपनी का नाम दर्ज करें' : 'Enter company name'}
                    type="text"
                    name="companyName"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'वेबसाइट' : 'Website'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'www.example.com' : 'www.example.com'}
                    type="url"
                    name="website"
                    onChange={handleChange}
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'उद्योग क्षेत्र *' : 'Industry Sector *'}
                  </label>
                  <select
                    className="inquiry-input"
                    name="industry"
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
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'कंपनी का आकार' : 'Company Size'}
                  </label>
                  <select
                    className="inquiry-input"
                    name="companySize"
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
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Enter your name'}
                    type="text"
                    name="contactName"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'पदनाम *' : 'Designation *'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder={lang === 'hi' ? 'जैसे HR Manager' : 'e.g., HR Manager'}
                    type="text"
                    name="designation"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'ईमेल *' : 'Email *'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder="email@example.com"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                  </label>
                  <input
                    className="inquiry-input"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    name="phone"
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
                    <label className="inquiry-label">
                      {lang === 'hi' ? 'भूमिका/पद *' : 'Role/Position *'}
                    </label>
                    <input
                      className="inquiry-input"
                      placeholder={lang === 'hi' ? 'जैसे Software Engineer' : 'e.g., Software Engineer'}
                      type="text"
                      name="role"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label">
                      {lang === 'hi' ? 'रिक्तियों की संख्या *' : 'Number of Positions *'}
                    </label>
                    <input
                      className="inquiry-input"
                      placeholder={lang === 'hi' ? 'संख्या दर्ज करें' : 'Enter number'}
                      type="number"
                      name="positions"
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="inquiry-field inquiry-field-branches">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'इच्छित शाखाएँ' : 'Preferred Branches'}
                  </label>
                  <div className="inquiry-branch-grid">
                    {[
                      lang === 'hi' ? 'CS (AI & ML)' : 'CS (AI & ML)',
                      lang === 'hi' ? 'CS (साइबर सुरक्षा)' : 'CS (Cyber Security)',
                      lang === 'hi' ? 'रोबोटिक्स' : 'Robotics & Automation',
                      lang === 'hi' ? 'सभी शाखाएँ' : 'All Branches'
                    ].map((branch, idx) => (
                      <label key={idx} className="inquiry-branch-option">
                        <input type="checkbox" name={`branch-${idx}`} onChange={handleChange} />
                        {branch}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="inquiry-field">
                  <label className="inquiry-label">
                    {lang === 'hi' ? 'अतिरिक्त जानकारी' : 'Additional Information'}
                  </label>
                  <textarea
                    className="inquiry-input inquiry-textarea"
                    placeholder={lang === 'hi' ? 'नौकरी विवरण, पात्रता मानदंड, वेतन सीमा, आदि।' : 'Job description, eligibility criteria, salary range, etc.'}
                    name="additionalInfo"
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
                  type="checkbox"
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
              >
                {lang === 'hi' ? 'फॉर्म जमा करें' : 'Submit Application'}
              </button>
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
