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
import ProfileCard from "../components/dashboard/ProfileCard"

import { 
  Bell, 
  CalendarDays, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  UserRound, 
  CheckCircle, 
  Activity, 
  Briefcase, 
  Building2 
} from "lucide-react"

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

  // Navigation tab state: 'overview' | 'pipeline' | 'vault' | 'profile'
  const [activeTab, setActiveTab] = useState("overview")

  // Responsiveness & Header Scroll state
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const completion = useMemo(() => {
    const fields = [profile.cgpa, profile.skills?.length, profile.resumeUrl, profile.phone, profile.linkedin]
    return fields.filter(Boolean).length * 20
  }, [profile])

  const currentEvents = events.filter(event => !event.type || event.type === "upcoming")
  const pastEvents = events.filter(event => event.type === "past")

  async function apply(event) {
    if (!db || !user) return
    const application = { uid: user.uid, eventId: event.id, company: event.company, status: "Applied", appliedAt: serverTimestamp() }
    await setDoc(doc(db, "applications", `${user.uid}_${event.id}`), application)
    setApplications(current => [...current.filter(item => item.eventId !== event.id), { ...application, id: `${user.uid}_${event.id}` }])
  }

  async function markRead(id) {
    setAnnouncements(current => current.map(item => item.id === id ? { ...item, read: true } : item))
  }

  function dismiss(id) { 
    setAnnouncements(current => current.filter(item => item.id !== id)) 
  }

  if (loading) {
    return (
      <div className="login-page" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '4px solid var(--gold)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p className="db-label">Loading candidate portal...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="portal-loading">
        {firebaseEnvError || "Sign in to access the candidate placement portal."}
      </div>
    )
  }

  return (
    <div className="login-page" style={{ flexDirection: 'column', background: 'var(--parchment)', minHeight: '100vh' }}>
      
      {/* Top Navbar Header (Identical to Admin Dashboard) */}
      <header 
        className="db-header"
        style={{
          padding: isScrolled ? '0.5rem 1.5rem' : '1.25rem 2rem',
          height: isScrolled ? '4.25rem' : '6.5rem',
          transition: 'all 0.3s ease-out',
          boxShadow: isScrolled ? '0 4px 20px rgba(10,22,40,0.08)' : 'none'
        }}
      >
        <div className="db-brand" style={{ gap: '1rem' }}>
          <div 
            style={{ 
              height: isScrolled ? '3rem' : '4.5rem', 
              width: isScrolled ? '3rem' : '4.5rem', 
              transition: 'all 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              padding: '2px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(10,22,40,0.05)'
            }}
          >
            <img src="/images/cleanersietlogo.png" alt="SIET Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 
              className="db-brand-title"
              style={{ 
                fontSize: isScrolled ? '1.15rem' : '1.65rem', 
                transition: 'all 0.3s ease-out',
                margin: 0,
                fontWeight: '800'
              }}
            >
              SIET Panchkula
            </h1>
            <p 
              className="db-brand-sub"
              style={{ 
                fontSize: isScrolled ? '0.625rem' : '0.8rem', 
                transition: 'all 0.3s ease-out',
                margin: 0,
                letterSpacing: '0.12em'
              }}
            >
              Candidate Portal
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <p 
              className="db-brand-title" 
              style={{ 
                fontSize: isScrolled ? '0.8rem' : '0.95rem', 
                transition: 'all 0.3s ease-out',
                textTransform: 'uppercase', 
                margin: 0,
                fontWeight: 'bold'
              }}
            >
              {profile.fullName || user.displayName || "Student Candidate"}
            </p>
            <p className="db-status" style={{ margin: 0 }}>
              <span className="db-status-dot" /> Online
            </p>
          </div>
          <button 
            onClick={() => signOut(auth).then(() => navigate("/login"))}
            className="db-logout"
            style={{
              padding: isScrolled ? '0.4rem 0.6rem' : '0.6rem 0.8rem',
              transition: 'all 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Log Out"
          >
            <LogOut style={{ width: isScrolled ? '1.1rem' : '1.35rem', height: isScrolled ? '1.1rem' : '1.35rem', transition: 'all 0.3s ease-out' }} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="db-container animate-fade-up">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '42rem' }}>
            <h2 className="section-title" style={{ textAlign: 'left', color: 'var(--ink)', marginBottom: '0.5rem' }}>
              Student Placement Desk
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'left', color: 'var(--muted-foreground)', margin: 0 }}>
              Welcome back, <strong>{profile.fullName || user.displayName || "Student"}</strong> ({profile.branch || "Branch not specified"} · {profile.batch || "Cohort 2025"}).
            </p>
          </div>
        </div>

        {/* Profile Completion Nudge Banner */}
        {!profile.profileCompleted && (
          <div 
            style={{
              background: 'rgba(201,146,42,0.1)',
              border: '1px solid rgba(201,146,42,0.4)',
              borderRadius: '6px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: 'var(--gold)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: 'var(--ink)' }}>
                  Complete Your Candidate Profile
                </h4>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                  Complete the 4-step registration form (Identity, Academics, Skills, Review) to unlock all drive applications.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/student-form")}
              className="db-btn-next"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Fill Profile Form →
            </button>
          </div>
        )}

        {/* Quick Stats Cards Grid */}
        <div className="db-stat-grid">
          <div className="db-stat-card">
            <div className="db-stat-icon-wrap stat-emerald">
              <CheckCircle style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <div className="db-stat-val">{completion}%</div>
              <span className="db-stat-label">Profile Readiness</span>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-icon-wrap stat-blue">
              <CalendarDays style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <div className="db-stat-val">{currentEvents.length}</div>
              <span className="db-stat-label">Open Campus Drives</span>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-icon-wrap stat-amber">
              <Activity style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <div className="db-stat-val">{applications.length}</div>
              <span className="db-stat-label">Applications Sent</span>
            </div>
          </div>

          <div className="db-stat-card">
            <div className="db-stat-icon-wrap stat-indigo">
              <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
            </div>
            <div>
              <div className="db-stat-val">{documents.length}</div>
              <span className="db-stat-label">Vault Documents</span>
            </div>
          </div>
        </div>

        {/* Navigation Submenu Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '2px solid rgba(10,22,40,0.1)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Overview & Campus Drives', icon: LayoutDashboard, count: currentEvents.length },
            { id: 'pipeline', label: 'Drive Pipeline & Resume', icon: Briefcase, count: applications.length },
            { id: 'vault', label: 'Document Vault & Bulletins', icon: FileText, count: documents.length },
            { id: 'profile', label: 'Candidate Profile Settings', icon: UserRound, count: null },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.85rem 1.5rem',
                  background: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? 'var(--parchment)' : 'var(--ink)',
                  border: 'none',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 -2px 10px rgba(10,22,40,0.1)' : 'none'
                }}
              >
                <Icon style={{ width: '1.1rem', height: '1.1rem', color: isActive ? 'var(--gold)' : 'inherit' }} />
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    background: isActive ? 'var(--gold)' : 'rgba(10,22,40,0.08)',
                    color: 'var(--ink)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: '800'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB CONTENT 1: OVERVIEW & DRIVES */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <EventList 
              title="Upcoming Campus Drives" 
              events={currentEvents} 
              applications={applications} 
              onApply={apply} 
              branch={profile.branch} 
              cgpa={profile.cgpa}
            />

            {pastEvents.length > 0 && (
              <EventList 
                title="Past Campus Drives" 
                events={pastEvents} 
                applications={applications} 
                past
              />
            )}
          </div>
        )}

        {/* TAB CONTENT 2: PIPELINE & RESUME */}
        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <ApplicationTracker applications={applications} events={events} expanded />
            <ResumeCard resumeUrl={profile.resumeUrl} />
          </div>
        )}

        {/* TAB CONTENT 3: VAULT & BULLETINS */}
        {activeTab === 'vault' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            <DocumentVault 
              user={user} 
              documents={documents} 
              onUploaded={async item => { 
                setDocuments(current => [item, ...current])
                if (item.type === "resume") { 
                  await setDoc(doc(db, "students", user.uid), { resumeUrl: item.fileUrl, updatedAt: serverTimestamp() }, { merge: true }) 
                } 
              }}
            />
            <NotificationFeed 
              announcements={announcements} 
              branch={profile.branch} 
              onRead={markRead} 
              onDismiss={dismiss}
            />
          </div>
        )}

        {/* TAB CONTENT 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <ProfileMeter completion={completion} deadlineSoon={false} />
            <ProfileCard user={user} profile={profile} />
          </div>
        )}

      </main>
    </div>
  )
}
