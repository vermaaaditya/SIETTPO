import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { ArrowLeft, ArrowRight, Check, FileText, ImagePlus, Upload, UserRound } from "lucide-react"
import { auth, db } from "../lib/firebase"

const steps = ["Identity", "Academics", "Skills", "Review"]
const initialForm = {
  fullName: "", fatherName: "", motherName: "", dob: "", gender: "", mobile: "", personalEmail: "", address: "",
  rollNumber: "", branch: "", semester: "", graduationYear: "", percentage10: "", percentage12: "", cgpa: "", backlogs: "No backlogs",
  skills: [], skillsInput: "", linkedin: "", github: "", portfolio: "", resumeUrl: "", marksheetUrl: "", photoUrl: "",
}

export default function StudentProfileForm() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState("")

  useEffect(() => onAuthStateChanged(auth, currentUser => {
    if (!currentUser) navigate("/login", { replace: true })
    else {
      setUser(currentUser)
      setForm(current => ({ ...current, fullName: current.fullName || currentUser.displayName || "", personalEmail: current.personalEmail || currentUser.email || "" }))
    }
  }), [navigate])

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const addSkill = event => {
    if ((event.key === "Enter" || event.key === ",") && form.skillsInput.trim()) {
      event.preventDefault()
      const skill = form.skillsInput.trim().replace(/,$/, "")
      if (!form.skills.includes(skill)) update("skills", [...form.skills, skill])
      update("skillsInput", "")
    }
  }
  const removeSkill = skill => update("skills", form.skills.filter(item => item !== skill))

  async function uploadFile(event, key) {
    const file = event.target.files?.[0]
    if (!file) return
    const maxSize = key === "photoUrl" ? 1 : 2
    if (file.size > maxSize * 1024 * 1024) { setMessage(`File must be under ${maxSize}MB.`); return }
    setUploading(key); setMessage("")
    try {
      const token = await auth.currentUser.getIdToken()
      const data = new FormData()
      data.append("document", file)
      const response = await fetch("https://tpo.sietpanchkula.ac.in/api/upload-document.php", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Upload failed")
      update(key, result.fileUrl)
    } catch (error) { setMessage(error.message || "Upload failed.") }
    finally { setUploading("") }
  }
  function validateCurrentStep() {
    const required = step === 0
      ? [["fullName", "Full name"], ["fatherName", "Father's name"], ["motherName", "Mother's name"], ["dob", "Date of birth"], ["gender", "Gender"], ["mobile", "Mobile number"], ["personalEmail", "Personal email"], ["address", "Permanent address"]]
      : step === 1
        ? [["rollNumber", "University roll number"], ["branch", "Academic branch"], ["semester", "Current semester"], ["graduationYear", "Graduation year"], ["percentage10", "10th percentage"], ["percentage12", "12th percentage"], ["cgpa", "B.Tech CGPA"]]
        : step === 2 ? [["skills", "Skills"]] : []
    const missing = required.find(([key]) => !form[key] || (Array.isArray(form[key]) && form[key].length === 0))
    if (missing) { setMessage(`${missing[1]} is required.`); return false }
    setMessage("")
    return true
  }

  async function saveProfile() {
    if (!user || !db) return
    setSaving(true)
    try {
      await setDoc(doc(db, "students", user.uid), {
        ...form,
        phone: form.mobile,
        batch: form.graduationYear,
        skills: form.skills,
        profileCompleted: true,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      navigate("/dashboard")
    } catch (error) { setMessage(error.message || "Could not save your profile.") }
    finally { setSaving(false) }
  }

  if (!user) return <div className="portal-loading">Loading profile form...</div>

  return <main className="student-form-page">
    <header className="student-form-header db-header"><div className="db-brand form-db-brand"><div className="form-logo"><img src="/images/cleanersietlogo.png" alt="SIET Logo" /></div><div><h1>SIET Panchkula</h1><p>Student Portal</p></div></div><button type="button" className="form-back" onClick={() => navigate("/dashboard")}><ArrowLeft size={16}/> Dashboard</button></header>
    <div className="form-stepper">{steps.map((label, index) => <div className={`form-step ${index <= step ? "active" : ""}`} key={label}><span>{index < step ? <Check size={16}/> : index + 1}</span><strong>{label}</strong></div>)}</div>
    <section className="student-form-card">
      {step === 0 && <><FormHeading title="Personal Identity" subtitle="Tell us about yourself exactly as shown on your official documents."/><div className="student-form-grid">{input("fullName", "Full name", "As printed on marksheet")}{input("fatherName", "Father's name", "Full legal name")}{input("motherName", "Mother's name", "Full legal name")}{input("dob", "Date of birth", "", "date")}{select("gender", "Gender", ["Male", "Female", "Other"])}{input("mobile", "Mobile number", "e.g. 9876543210", "tel")}{input("personalEmail", "Personal email", "student@example.com", "email")}</div>{textarea("address", "Permanent address", "House no, street, city, district, state, PIN")}</>}
      {step === 1 && <><FormHeading title="Academic Record" subtitle="Ensure data exactly matches your official university transcripts."/><div className="student-form-grid">{input("rollNumber", "University roll number", "e.g. 2025113600")}{select("branch", "Academic branch", ["Computer Science and Engineering", "Computer Science and Engineering (AI & ML)", "Cyber Security", "Robotics & Automation", "Electrical Engineering", "Electronics Engineering (VLSI Design)"])}{select("semester", "Current semester", ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"])}{select("graduationYear", "Graduation year", ["2026", "2027", "2028", "2029", "2030"])}</div><div className="student-form-highlight">{input("percentage10", "10th class %", "e.g. 89.5", "number")}{input("percentage12", "12th / Diploma %", "e.g. 87.2", "number")}{input("cgpa", "B.Tech CGPA", "e.g. 8.42", "number")}</div>{select("backlogs", "Active backlogs", ["No backlogs", "1 backlog", "2 backlogs", "3 or more backlogs"])}</>}
      {step === 2 && <><FormHeading title="Skills & Professional Profile" subtitle="Showcase the skills and links that help recruiters understand your strengths."/><label className="student-form-label"><span>Skills <em>*</em></span><input value={form.skillsInput} onChange={event => update("skillsInput", event.target.value)} onKeyDown={addSkill} placeholder="Type skills and press Enter or Comma (e.g. React, Python, Java)" /></label><div className="skill-chips">{form.skills.map(skill => <button type="button" key={skill} onClick={() => removeSkill(skill)}>{skill} ×</button>)}</div><div className="student-form-grid three">{input("linkedin", "LinkedIn profile", "https://linkedin.com/in/...")}{input("github", "GitHub profile", "https://github.com/...")}{input("portfolio", "Personal portfolio", "https://...")}</div><div className="upload-grid">{uploadBox("resumeUrl", "Resume (PDF)", "Max 2MB PDF", FileText)}{uploadBox("marksheetUrl", "Latest marksheet", "Max 2MB PDF/Image", FileText)}{uploadBox("photoUrl", "Professional photo", "Square image, Max 1MB", ImagePlus)}</div></>}
      {step === 3 && <><FormHeading title="Final Verification" subtitle="Please review your profile carefully. Upon submission, it will be locked for administrative verification."/><div className="review-block"><h3>1&nbsp;&nbsp; Personal Identity</h3><Review label="Full name" value={form.fullName}/><Review label="Father's name" value={form.fatherName}/><Review label="Mother's name" value={form.motherName}/><Review label="Contact" value={`${form.mobile} · ${form.personalEmail}`}/><Review label="Permanent address" value={form.address}/></div><div className="review-block"><h3>2&nbsp;&nbsp; Academic Record</h3><Review label="Roll number" value={form.rollNumber}/><Review label="Branch" value={form.branch}/><Review label="CGPA" value={form.cgpa}/><Review label="Skills" value={form.skills.join(", ")}/></div></>}
      {message && <p className="student-form-message">{message}</p>}
      <footer className="student-form-actions">{step > 0 && <button type="button" className="form-secondary" onClick={() => { setMessage(""); setStep(step - 1) }}>Go back</button>}{step < 3 ? <button type="button" className="form-primary" onClick={() => validateCurrentStep() && setStep(step + 1)}>Proceed to {steps[step + 1]} <ArrowRight size={17}/></button> : <button type="button" className="form-primary" disabled={saving} onClick={saveProfile}>{saving ? "Submitting..." : "Submit profile"} <Check size={17}/></button>}</footer>
    </section>
  </main>

  function input(key, label, placeholder, type = "text") { return <label className="student-form-label"><span>{label} <em>*</em></span><input type={type} value={form[key]} onChange={event => update(key, event.target.value)} placeholder={placeholder}/></label> }
  function select(key, label, options) { return <label className="student-form-label"><span>{label} <em>*</em></span><select value={form[key]} onChange={event => update(key, event.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(option => <option key={option}>{option}</option>)}</select></label> }
  function textarea(key, label, placeholder) { return <label className="student-form-label full"><span>{label} <em>*</em></span><textarea value={form[key]} onChange={event => update(key, event.target.value)} placeholder={placeholder}/></label> }
  function uploadBox(key, label, hint, Icon) { return <label className="upload-box"><span>{label} <em>*</em></span><Icon size={28}/><strong><Upload size={16}/> {uploading === key ? "Uploading..." : `Upload ${label.split(" ")[0]}`}</strong><small>{hint}</small><input type="file" accept={key === "photoUrl" ? "image/jpeg,image/png" : key === "resumeUrl" ? "application/pdf" : "application/pdf,image/jpeg,image/png"} onChange={event => uploadFile(event, key)} /></label> }
}

function FormHeading({ title, subtitle }) { return <div className="student-form-heading"><h1>{title}</h1><p>{subtitle}</p></div> }
function Review({ label, value }) { return <div className="review-item"><small>{label}</small><strong>{value || "—"}</strong></div> }







