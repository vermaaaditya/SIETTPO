import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { ArrowLeft, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { auth, db, firebaseEnvError } from "../lib/firebase"
const ADMIN_EMAIL = "vermaaadityaff123@gmail.com"

export default function StudentLogin() {
  const navigate = useNavigate()
  const [mode, setMode] = useState("register")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")

  function handlePanelMouseMove(event) {
    const panel = event.currentTarget
    const rect = panel.getBoundingClientRect()
    panel.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
    panel.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setFullName("")
    setEmail("")
    setPassword("")
    setStatus(null)
    setStatusMessage("")
  }

  async function submit(event) {
    event.preventDefault()
    if (!auth || (mode === "register" && !db)) {
      setStatus("error")
      setStatusMessage(firebaseEnvError || "Firebase is not configured. Contact the administrator.")
      return
    }
    if (mode === "register" && !fullName.trim()) {
      setStatus("error")
      setStatusMessage("Please enter your full name.")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setStatus("error")
      setStatusMessage("Please enter a valid institute email address.")
      return
    }
    if (password.length < 8) {
      setStatus("error")
      setStatusMessage("Password must contain at least 8 characters.")
      return
    }

    setStatus("loading")
    setStatusMessage("")
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
        await updateProfile(credential.user, { displayName: fullName.trim() })
        await setDoc(doc(db, "students", credential.user.uid), {
          fullName: fullName.trim(), email: email.trim().toLowerCase(), branch: "", batch: "",
          skills: [], cgpa: null, phone: "", linkedin: "", resumeUrl: "",
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        })
        setStatusMessage("Registration successful. Redirecting to your dashboard...")
      } else {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
        setStatusMessage("Login successful. Redirecting to your dashboard...")
      }
      setStatus("success")
      setTimeout(() => navigate(email.trim().toLowerCase() === ADMIN_EMAIL ? "/admin" : "/dashboard"), 700)
    } catch (error) {
      setStatus("error")
      setStatusMessage(error.message || `${mode === "register" ? "Registration" : "Login"} failed. Please try again.`)
    }
  }

  return (
    <div className="login-page">
      <section className="login-left" onMouseMove={handlePanelMouseMove}>
        <div className="login-left-grid" aria-hidden="true" />
        <div className="login-left-glow" aria-hidden="true" />
        <div className="login-left-glow-top" aria-hidden="true" />
        <div className="login-left-brand">
          <img src="/images/cleanersietlogo.png" alt="SIET Panchkula" />
          <div><div className="login-left-brand-name">SIET PANCHKULA</div><div className="login-left-brand-sub">TRAINING &amp; PLACEMENT OFFICE</div></div>
        </div>
        <div className="login-left-content">
          <h1 className="login-left-headline">Training &amp; Placement <em>Office</em></h1>
          <p className="login-left-desc">State Institute of Engineering &amp; Technology, Panchkula. Connecting students with career opportunities and coordinating drive operations.</p>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <button className="login-back-link" type="button" onClick={() => navigate("/")}><ArrowLeft /> Return to portal</button>
          <div className="login-title"><span>Training &amp; Placement Office</span><h2>{mode === "register" ? "Register" : "Log In"}</h2><p>{mode === "register" ? "Create a profile with your college email." : "Access your placement dashboard."}</p></div>
          <div className="login-mode-toggle" role="tablist" aria-label="Authentication mode">
            <button type="button" className={`login-mode-btn ${mode === "login" ? "active" : ""}`} onClick={() => changeMode("login")}>Log In</button>
            <button type="button" className={`login-mode-btn ${mode === "register" ? "active" : ""}`} onClick={() => changeMode("register")}>Register</button>
          </div>
          <form onSubmit={submit} noValidate>
            {mode === "register" && <label className="login-field"><span>Full name</span><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="As printed on marksheet" autoComplete="name" /></label>}
            <label className="login-field"><span>Institute email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@sietpanchkula.ac.in" autoComplete="email" /></label>
            <label className="login-field"><span>{mode === "register" ? "Choose a password" : "Password"}</span><div className="login-password-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "register" ? "Minimum 8 characters" : "Enter your password"} autoComplete={mode === "register" ? "new-password" : "current-password"} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            {statusMessage && <p className={`login-status ${status}`} role="status">{status === "success" ? <CheckCircle2 /> : <AlertCircle />}{statusMessage}</p>}
            <button className="login-submit" type="submit" disabled={status === "loading"}><span>{status === "loading" ? "Please wait..." : mode === "register" ? "Register" : "Log In"}</span><ArrowRight /></button>
          </form>
        </div>
      </section>
    </div>
  )
}

