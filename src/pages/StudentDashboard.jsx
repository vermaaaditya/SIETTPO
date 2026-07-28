import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import { auth, db, firebaseEnvError } from "../lib/firebase"
import ProfileMeter from "../components/dashboard/ProfileMeter"
import ResumeCard from "../components/dashboard/ResumeCard"
import EventList from "../components/dashboard/EventList"
import ApplicationTracker from "../components/dashboard/ApplicationTracker"
import NotificationFeed from "../components/dashboard/NotificationFeed"
import DocumentVault from "../components/dashboard/DocumentVault"

import { Bell, CalendarDays, FileText, LayoutDashboard, LogOut, UserRound } from "lucide-react"

const demoEvents = [
  { id: "accenture-2026", company: "Accenture", title: "Campus Hiring Drive", date: new Date("2026-07-29"), registrationDeadline: new Date("2026-07-27"), eligibility: { branch: ["CSE", "IT", "ECE"], minCgpa: 6.5 } },
  { id: "infosys-2026", company: "Infosys", title: "Specialist Programmer", date: new Date("2026-08-04"), registrationDeadline: new Date("2026-07-31"), eligibility: { branch: ["CSE", "IT"], minCgpa: 7 } },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({})
  const [events, setEvents] = useState([])
  const [applications, setApplications] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState("Dashboard")

  useEffect(() => {
    if (!auth || !db) { setLoading(false); return }
    return onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) { navigate("/login", { replace: true }); return }
      setUser(currentUser)
      const profileRef = doc(db, "students", currentUser.uid)
      const stopProfile = onSnapshot(profileRef, snap => setProfile(snap.exists() ? snap.data() : { fullName: currentUser.displayName, email: currentUser.email }))
      const [eventSnap, announcementSnap, documentSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "documents"), where("uid", "==", currentUser.uid))),
      ]).catch(() => [{ docs: [] }, { docs: [] }, { docs: [] }])
      const loadedEvents = eventSnap.docs.map(item => ({ id: item.id, ...item.data() }))
      setEvents(loadedEvents.length ? loadedEvents : demoEvents)
      setAnnouncements(announcementSnap.docs.map(item => ({ id: item.id, ...item.data() })))
      setDocuments(documentSnap.docs.map(item => ({ id: item.id, ...item.data() })))
      const appSnaps = await Promise.all((loadedEvents.length ? loadedEvents : demoEvents).map(event => getDoc(doc(db, "applications", `${currentUser.uid}_${event.id}`))))
      setApplications(appSnaps.filter(item => item.exists()).map(item => ({ id: item.id, ...item.data() })))
      setLoading(false)
      return () => stopProfile()
    })
  }, [navigate])

  const completion = useMemo(() => [profile.cgpa, profile.skills?.length, profile.resumeUrl, profile.phone, profile.linkedin].filter(Boolean).length * 20, [profile])
  const currentEvents = events.filter(event => !event.type || event.type === "upcoming")
  const pastEvents = events.filter(event => event.type === "past")
  const hasDeadlineSoon = currentEvents.some(event => { const date = toDate(event.registrationDeadline); return date && date - new Date() < 7 * 86400000 && date > new Date() })

  async function apply(event) {
    if (!db || !user) return
    const application = { uid: user.uid, eventId: event.id, company: event.company, status: "Applied", appliedAt: serverTimestamp() }
    await setDoc(doc(db, "applications", `${user.uid}_${event.id}`), application)
    setApplications(current => [...current.filter(item => item.eventId !== event.id), { ...application, id: `${user.uid}_${event.id}` }])
  }

  async function markRead(id) {
    setAnnouncements(current => current.map(item => item.id === id ? { ...item, read: true } : item))
  }
  function dismiss(id) { setAnnouncements(current => current.filter(item => item.id !== id)) }
  function selectNav(item) { setActive(item); document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" }) }
  if (loading) return <div className="portal-loading">Loading your placement dashboardâ€¦</div>
  if (!user) return <div className="portal-loading">{firebaseEnvError || "Sign in to access the dashboard."}</div>

  return <div className="student-portal">
    <aside className="portal-sidebar"><div className="portal-mark">SIET <span>TPO</span></div><nav>{[[LayoutDashboard,"Dashboard"],[FileText,"Resume"],[CalendarDays,"Events"],[Bell,"Applications"],[FileText,"Documents"],[UserRound,"Profile"]].map(([Icon,label]) => <button key={label} className={active === label ? "active" : ""} onClick={() => selectNav(label)}><Icon size={18}/>{label}</button>)}</nav><button className="portal-logout" onClick={() => signOut(auth).then(() => navigate("/login"))}><LogOut size={17}/> Log out</button></aside>
    <main className="portal-main"><header className="portal-header"><div><p className="portal-eyebrow">Student placement desk</p><h1>Welcome back, {profile.fullName || user.displayName || "Student"}</h1><p>{profile.branch || "Add your branch"} Â· {profile.batch || "Batch not set"}</p></div><div className="student-avatar">{profile.photoUrl ? <img src={profile.photoUrl} alt="Profile"/> : (profile.fullName || user.email || "S").slice(0,1)}</div></header>
      <section id="dashboard" className="portal-summary"><div><ProfileMeter completion={completion} deadlineSoon={hasDeadlineSoon}/><button className="complete-profile-button" onClick={() => navigate("/student-form")}>Complete profile <span>→</span></button></div><ApplicationTracker applications={applications} events={events}/></section>
      <section id="resume"><ResumeCard resumeUrl={profile.resumeUrl}/></section>
      <section id="events"><EventList title="Upcoming drives" events={currentEvents} applications={applications} onApply={apply} branch={profile.branch} cgpa={profile.cgpa}/>{pastEvents.length > 0 && <EventList title="Past drives" events={pastEvents} applications={applications} past/>}</section>
      <section id="applications"><ApplicationTracker applications={applications} events={events} expanded/></section>
      <section className="portal-two-column"><div id="documents"><DocumentVault user={user} documents={documents} onUploaded={async item => { setDocuments(current => [item, ...current]); if (item.type === "resume") { await setDoc(doc(db, "students", user.uid), { resumeUrl: item.fileUrl, updatedAt: serverTimestamp() }, { merge: true }) } }}/></div><NotificationFeed announcements={announcements} branch={profile.branch} onRead={markRead} onDismiss={dismiss}/></section>
      
    </main>
  </div>
}

function toDate(value) { return value?.toDate ? value.toDate() : value instanceof Date ? value : value ? new Date(value) : null }


