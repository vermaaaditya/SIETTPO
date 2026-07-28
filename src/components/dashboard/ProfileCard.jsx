import { useEffect, useState } from "react"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { Save, UserRound, CheckCircle2 } from "lucide-react"
import { db } from "../../lib/firebase"

export default function ProfileCard({ user, profile }) {
  const [form, setForm] = useState({})
  const [message, setMessage] = useState("")

  useEffect(() => {
    setForm({
      fullName: profile.fullName || user.displayName || "",
      branch: profile.branch || "",
      batch: profile.batch || "",
      cgpa: profile.cgpa || "",
      skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
      phone: profile.phone || "",
      linkedin: profile.linkedin || ""
    })
  }, [profile, user])

  async function save(event) {
    event.preventDefault()
    if (!db) return
    const payload = {
      ...form,
      cgpa: form.cgpa ? Number(form.cgpa) : null,
      skills: form.skills.split(",").map(item => item.trim()).filter(Boolean),
      updatedAt: serverTimestamp()
    }
    await setDoc(doc(db, "students", user.uid), payload, { merge: true })
    setMessage("Profile details saved successfully.")
  }

  const fields = [
    ["fullName", "Full Candidate Name"],
    ["branch", "Academic Branch"],
    ["batch", "Graduation Batch"],
    ["cgpa", "Current CGPA"],
    ["skills", "Skills & Tech Stack (comma separated)"],
    ["phone", "Mobile / Contact Number"],
    ["linkedin", "LinkedIn Profile URL"]
  ]

  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            Candidate Profile
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>Student Record Settings</h3>
        </div>
        <UserRound style={{ width: '1.75rem', height: '1.75rem', color: 'var(--gold)' }} />
      </div>

      <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {fields.map(([key, label]) => (
          <div key={key} className="db-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {label}
            </label>
            <input 
              required={["cgpa", "skills", "phone", "linkedin"].includes(key)}
              value={form[key] || ""}
              type={key === "cgpa" ? "number" : "text"}
              step={key === "cgpa" ? "0.01" : undefined}
              onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))}
              className="db-search-input"
              style={{ width: '100%', padding: '0.6rem 0.85rem' }}
            />
          </div>
        ))}

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(10,22,40,0.08)' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {message && <CheckCircle2 size={16} />} {message}
          </span>

          <button 
            type="submit" 
            className="db-btn-next"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
          >
            <Save size={16} /> Save Candidate Profile
          </button>
        </div>
      </form>
    </div>
  )
}
