import { useEffect, useState } from "react"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { Save, UserRound } from "lucide-react"
import { db } from "../../lib/firebase"

export default function ProfileCard({ user, profile }) {
  const [form, setForm] = useState({})
  const [message, setMessage] = useState("")
  useEffect(() => setForm({ fullName: profile.fullName || user.displayName || "", branch: profile.branch || "", batch: profile.batch || "", cgpa: profile.cgpa || "", skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "", phone: profile.phone || "", linkedin: profile.linkedin || "" }), [profile, user])
  async function save(event) { event.preventDefault(); if (!db) return; const payload = { ...form, cgpa: form.cgpa ? Number(form.cgpa) : null, skills: form.skills.split(",").map(item => item.trim()).filter(Boolean), updatedAt: serverTimestamp() }; await setDoc(doc(db, "students", user.uid), payload, { merge: true }); setMessage("Profile saved.") }
  return <article className="portal-card profile-card"><div className="card-heading"><div><span>Student record</span><h2>Profile details</h2></div><UserRound color="var(--gold)"/></div><form onSubmit={save} className="profile-form">{[["fullName","Full name"],["branch","Branch"],["batch","Batch"],["cgpa","CGPA"],["skills","Skills (comma separated)"],["phone","Phone number"],["linkedin","LinkedIn URL"]].map(([key,label]) => <label key={key}>{label}<input required={["cgpa","skills","phone","linkedin"].includes(key)} value={form[key] || ""} type={key === "cgpa" ? "number" : "text"} step={key === "cgpa" ? "0.01" : undefined} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))}/></label>)}<div className="profile-save"><span>{message}</span><button><Save size={15}/> Save profile</button></div></form></article>
}
