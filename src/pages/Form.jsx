import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '../components/navbar'
import { Footer } from '../components/footer'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

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
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <header className="relative w-full bg-ink overflow-hidden py-16 md:py-20">
          {/* Academic grid texture */}
          <div className="absolute inset-0 academic-grid pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-gold hover:text-parchment transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {lang === 'hi' ? 'होम पर वापस जाएँ' : 'Back to Home'}
            </Link>

            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="md:w-3/5">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gold text-ink text-xs font-bold tracking-widest uppercase mb-6">
                  {lang === 'hi' ? 'भर्तीकर्ताओं के लिए' : 'For Recruiters'}
                </span>
                <h1 className="text-4xl md:text-5xl font-['DM_Serif_Display'] text-parchment leading-tight mb-6">
                  {lang === 'hi' ? 'भर्ती के लिए आवेदन करें' : 'Recruitment Inquiry Form'}
                </h1>
                <p className="text-lg text-parchment/70 max-w-xl leading-relaxed">
                  {lang === 'hi'
                    ? 'हमारे प्रतिभाशाली छात्रों को नियुक्त करने के लिए इस फॉर्म को पूरा करें। हम आपके साथ परिसर ड्राइव शेड्यूल करने और साझेदारी के अवसर तलाशने के लिए उत्सुक हैं।'
                    : 'Complete this form to initiate the recruitment process with SIET Panchkula. We look forward to connecting you with our talented students and scheduling campus drives.'
                  }
                </p>
              </div>
              <div className="md:w-2/5 w-full">
                <div className="bg-surface-container-highest p-6 rounded-lg border border-outline-variant/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-gold scale-125" style={{ fontVariationSettings: "'FILL' 1" }}>
                      stars
                    </span>
                    <span className="font-bold text-primary-container">{lang === 'hi' ? 'महत्वपूर्ण' : 'Important'}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {lang === 'hi'
                      ? 'कृपया सभी आवश्यक फ़ील्ड सटीक रूप से भरें। हमारी टीम 2-3 कार्य दिवसों के भीतर आपसे संपर्क करेगी।'
                      : 'Please fill all required fields accurately. Our team will contact you within 2-3 business days to discuss recruitment opportunities.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <div className="max-w-5xl mx-auto px-6 mt-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Company Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-lg border border-outline-variant/10"
            >
              <div className="flex items-center gap-3 mb-10 border-b border-surface-container pb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">domain</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-container font-['DM_Serif_Display']">
                  {lang === 'hi' ? 'कंपनी की जानकारी' : 'Company Information'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                    placeholder={lang === 'hi' ? 'कंपनी का नाम दर्ज करें' : 'Enter company name'}
                    type="text"
                    name="companyName"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'वेबसाइट' : 'Website'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                    placeholder={lang === 'hi' ? 'www.example.com' : 'www.example.com'}
                    type="url"
                    name="website"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'उद्योग क्षेत्र *' : 'Industry Sector *'}
                  </label>
                  <select
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium appearance-none bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
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
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'कंपनी का आकार' : 'Company Size'}
                  </label>
                  <select
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium appearance-none bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
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
              className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-lg border border-outline-variant/10"
            >
              <div className="flex items-center gap-3 mb-10 border-b border-surface-container pb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-container font-['DM_Serif_Display']">
                  {lang === 'hi' ? 'संपर्क व्यक्ति विवरण' : 'Contact Person Details'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                    placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Enter your name'}
                    type="text"
                    name="contactName"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'पदनाम *' : 'Designation *'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                    placeholder={lang === 'hi' ? 'जैसे HR Manager' : 'e.g., HR Manager'}
                    type="text"
                    name="designation"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'ईमेल *' : 'Email *'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                    placeholder="email@example.com"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'फोन नंबर *' : 'Phone Number *'}
                  </label>
                  <input
                    className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
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
              className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-lg border border-outline-variant/10"
            >
              <div className="flex items-center gap-3 mb-10 border-b border-surface-container pb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">work</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-container font-['DM_Serif_Display']">
                  {lang === 'hi' ? 'भर्ती आवश्यकताएं' : 'Recruitment Requirements'}
                </h2>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      {lang === 'hi' ? 'भूमिका/पद *' : 'Role/Position *'}
                    </label>
                    <input
                      className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                      placeholder={lang === 'hi' ? 'जैसे Software Engineer' : 'e.g., Software Engineer'}
                      type="text"
                      name="role"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      {lang === 'hi' ? 'रिक्तियों की संख्या *' : 'Number of Positions *'}
                    </label>
                    <input
                      className="soft-well h-12 px-4 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors"
                      placeholder={lang === 'hi' ? 'संख्या दर्ज करें' : 'Enter number'}
                      type="number"
                      name="positions"
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'इच्छित शाखाएँ' : 'Preferred Branches'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      lang === 'hi' ? 'CS (AI & ML)' : 'CS (AI & ML)',
                      lang === 'hi' ? 'CS (साइबर सुरक्षा)' : 'CS (Cyber Security)',
                      lang === 'hi' ? 'रोबोटिक्स' : 'Robotics & Automation',
                      lang === 'hi' ? 'सभी शाखाएँ' : 'All Branches'
                    ].map((branch, idx) => (
                      <label key={idx} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-fixed text-on-primary-fixed text-sm font-bold border-2 border-transparent hover:border-gold transition-all cursor-pointer">
                        <input type="checkbox" name={`branch-${idx}`} className="w-4 h-4 accent-gold" onChange={handleChange} />
                        {branch}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {lang === 'hi' ? 'अतिरिक्त जानकारी' : 'Additional Information'}
                  </label>
                  <textarea
                    className="soft-well min-h-32 px-4 py-3 rounded-t-lg focus:ring-0 text-primary-container font-medium bg-surface-container-low border-b-2 border-outline-variant focus:border-gold transition-colors resize-y"
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
              className="flex flex-col items-center gap-6 pt-10"
            >
              <div className="flex items-start gap-3 max-w-2xl">
                <input
                  className="mt-1 w-5 h-5 rounded border-outline-variant accent-gold cursor-pointer"
                  id="consent"
                  type="checkbox"
                  required
                />
                <label className="text-sm text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="consent">
                  {lang === 'hi'
                    ? 'मैं पुष्टि करता हूं कि प्रदान की गई जानकारी सटीक है और SIET पंचकुला के प्रशिक्षण एवं प्लेसमेंट कार्यालय को भर्ती अवसरों के लिए मुझसे संपर्क करने के लिए अधिकृत करता हूं।'
                    : 'I confirm that the information provided is accurate and authorize SIET Panchkula Training & Placement Office to contact me regarding recruitment opportunities.'
                  }
                </label>
              </div>
              <button
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-gold to-gold/90 text-ink font-bold text-base rounded-sm shadow-lg shadow-gold/20 hover:scale-105 hover:shadow-gold/30 active:scale-95 transition-all uppercase tracking-wider"
                type="submit"
              >
                {lang === 'hi' ? 'फॉर्म जमा करें' : 'Submit Application'}
              </button>
              <p className="text-sm text-muted-foreground">
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
