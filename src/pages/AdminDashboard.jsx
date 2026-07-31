import { useState, useEffect, useMemo } from 'react'
import { Download, Users, Activity, CheckCircle, Search, Trash2, ExternalLink, FileSpreadsheet, LogOut, Building2, Briefcase, Code, Filter, Mail, Phone, Calendar, Layers, Eye, FileText, ImagePlus, X, ShieldCheck, FileCheck } from 'lucide-react'
import { collection, getDocs, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db, firebaseEnvError } from '../lib/firebase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import * as XLSX from 'xlsx'

export default function AdminDashboard({ handleLogout }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Navigation tab state: 'students' | 'inquiries'
  const [activeTab, setActiveTab] = useState('students')

  // Students state
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [branchFilter, setBranchFilter] = useState("")
  const [inspectingStudent, setInspectingStudent] = useState(null)
  const [vaultDocuments, setVaultDocuments] = useState([])

  // Company Inquiries state
  const [inquiries, setInquiries] = useState([])
  const [inquirySearchTerm, setInquirySearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("")

  // Header & Screen responsiveness
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        let finalStudents = []
        let finalInquiries = []

        // 1. Try fetching from Firebase Firestore
        if (db) {
          try {
            const studentSnap = await getDocs(collection(db, "students"))
            finalStudents = studentSnap.docs.map(d => {
              const data = d.data()
              return {
                id: d.id,
                full_name: data.fullName || data.full_name || 'N/A',
                email: data.email || 'N/A',
                mobile_number: data.mobile_number || data.phone || data.mobile || 'N/A',
                roll_number: data.rollNumber || data.roll_number || 'N/A',
                branch: data.branch || 'N/A',
                cgpa: data.cgpa || 'N/A',
                backlogs: data.backlogs || 'No backlogs',
                verification_status: data.verification_status || data.status || 'seeking',
                father_name: data.father_name || data.fatherName || '',
                mother_name: data.mother_name || data.motherName || '',
                skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
                linkedin_url: data.linkedin_url || data.linkedin || '',
                github_url: data.github_url || data.github || '',
                portfolio_url: data.portfolio_url || data.portfolio || '',
                resume_url: data.resumeUrl || data.resume_url || data.resume || '',
                marksheet_url: data.marksheetUrl || data.marksheet_url || '',
                photo_url: data.photoUrl || data.photo_url || data.photo || '',
                personal_email: data.personalEmail || data.personal_email || '',
                address: data.address || '',
                percentage_10: data.percentage10 || data.percentage_10 || '',
                percentage_12: data.percentage12 || data.percentage_12 || '',
                graduation_year: data.graduationYear || data.passing_year || data.batch || '',
                created_at: data.createdAt?.toDate ? data.createdAt.toDate() : data.created_at || null
              }
            })

            const inquirySnap = await getDocs(collection(db, "recruitment_inquiries"))
            finalInquiries = inquirySnap.docs.map(d => {
              const data = d.data()
              return {
                id: d.id,
                company_name: data.companyName || data.company_name || 'N/A',
                website: data.website || '',
                industry: data.industry || 'N/A',
                company_size: data.companySize || data.company_size || 'N/A',
                contact_name: data.contactName || data.contact_name || 'N/A',
                designation: data.designation || 'N/A',
                email: data.email || 'N/A',
                phone: data.phone || 'N/A',
                job_role: data.jobRole || data.job_role || 'N/A',
                positions: data.positions || 0,
                preferred_branches: data.preferredBranches || data.preferred_branches || [],
                required_skills: data.requiredSkills || data.required_skills || [],
                additional_info: data.additionalInfo || data.additional_info || '',
                status: data.status || 'new',
                created_at: data.createdAt?.toDate ? data.createdAt.toDate() : data.created_at || null
              }
            })

            try {
              const vaultSnap = await getDocs(collection(db, "documents"))
              setVaultDocuments(vaultSnap.docs.map(vDoc => ({ id: vDoc.id, ...vDoc.data() })))
            } catch (vErr) {
              console.warn("Vault documents fetch notice:", vErr)
            }
          } catch (fsErr) {
            console.error("Firestore admin fetch error:", fsErr)
            setError(fsErr.message || "Failed to fetch records. Please check your Firestore security rules.")
          }
        }

        setStudents(finalStudents)
        setInquiries(finalInquiries)
      } catch (err) {
        setError(err.message || "Unable to load administrative data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle Search and Branch Filter for Students
  const filteredStudents = useMemo(() => {
    let result = students
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase()
      result = result.filter(s => 
        (s.full_name && s.full_name.toLowerCase().includes(q)) ||
        (s.roll_number && s.roll_number.toLowerCase().includes(q)) ||
        (s.skills && s.skills.toLowerCase().includes(q)) ||
        (s.father_name && s.father_name.toLowerCase().includes(q)) ||
        (s.mother_name && s.mother_name.toLowerCase().includes(q))
      )
    }
    if (branchFilter !== "") {
      result = result.filter(s => s.branch === branchFilter)
    }
    return result
  }, [searchTerm, branchFilter, students])

  const stats = useMemo(() => {
    const total = students.length
    const placed = students.filter(s => s.verification_status === "placed").length
    const eligible = students.filter(s => s.verification_status === "eligible").length
    const pending = students.filter(s => s.verification_status === "seeking" || !s.verification_status).length
    return { total, placed, pending, eligible }
  }, [students])

  // Handle Search and Industry Filter for Company Inquiries
  const filteredInquiries = useMemo(() => {
    let result = inquiries
    if (inquirySearchTerm.trim() !== "") {
      const q = inquirySearchTerm.toLowerCase()
      result = result.filter(i =>
        (i.company_name && i.company_name.toLowerCase().includes(q)) ||
        (i.contact_name && i.contact_name.toLowerCase().includes(q)) ||
        (i.job_role && i.job_role.toLowerCase().includes(q)) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        (Array.isArray(i.required_skills) && i.required_skills.some(sk => sk.toLowerCase().includes(q))) ||
        (i.additional_info && i.additional_info.toLowerCase().includes(q))
      )
    }
    if (industryFilter !== "") {
      result = result.filter(i => i.industry === industryFilter)
    }
    return result
  }, [inquirySearchTerm, industryFilter, inquiries])

  const handleUpdateStudentStatus = async (studentId, newStatus) => {
    try {
      if (db) {
        await updateDoc(doc(db, "students", studentId), {
          verification_status: newStatus,
          status: newStatus,
          updatedAt: serverTimestamp()
        })
      }
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, verification_status: newStatus } : s))
      if (inspectingStudent && inspectingStudent.id === studentId) {
        setInspectingStudent(prev => ({ ...prev, verification_status: newStatus }))
      }
    } catch (err) {
      alert("Could not update status: " + err.message)
    }
  }

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student profile?")) return
    try {
      if (db) {
        await deleteDoc(doc(db, "students", id))
      }
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert("Delete failed: " + err.message)
    }
  }

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company recruitment inquiry?")) return
    try {
      if (db) {
        await deleteDoc(doc(db, "recruitment_inquiries", id))
      }
      setInquiries(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      alert("Delete failed: " + err.message)
    }
  }

  const handleExportStudents = () => {
    if (filteredStudents.length === 0) {
      alert("No student data available to export.")
      return
    }

    const formattedData = filteredStudents.map(student => ({
      'Full Name': student.full_name || 'N/A',
      'Father\'s Name': student.father_name || 'N/A',
      'Mother\'s Name': student.mother_name || 'N/A',
      'Email': student.email || 'N/A',
      'Mobile Number': student.mobile_number || 'N/A',
      'Roll Number': student.roll_number || 'N/A',
      'Branch': student.branch || 'N/A',
      'Passing Year': student.passing_year || 'N/A',
      'CGPA': student.cgpa || 'N/A',
      'Active Backlogs': student.backlogs || 'N/A',
      '10th %': student.percentage_10 || 'N/A',
      '12th/Diploma %': student.percentage_12 || 'N/A',
      'Skills': student.skills || 'N/A',
      'LinkedIn': student.linkedin_url || 'N/A',
      'GitHub': student.github_url || 'N/A',
      'Portfolio': student.portfolio_url || 'N/A',
      'Status': student.verification_status || 'Seeking',
      'Registered At': student.created_at ? new Date(student.created_at).toLocaleString() : 'N/A'
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
    XLSX.writeFile(workbook, `SIET_TPO_Profiles_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleExportInquiries = () => {
    if (filteredInquiries.length === 0) {
      alert("No company inquiry data available to export.")
      return
    }

    const formattedData = filteredInquiries.map(inquiry => {
      const skillsList = getSkillsList(inquiry)
      return {
        'Company Name': inquiry.company_name || 'N/A',
        'Website': inquiry.website || 'N/A',
        'Industry Sector': inquiry.industry || 'N/A',
        'Company Size': inquiry.company_size || 'N/A',
        'Contact Person': inquiry.contact_name || 'N/A',
        'Designation': inquiry.designation || 'N/A',
        'Email': inquiry.email || 'N/A',
        'Phone Number': inquiry.phone || 'N/A',
        'Job Role': inquiry.job_role || 'N/A',
        'Positions': inquiry.positions || 0,
        'Preferred Branches': Array.isArray(inquiry.preferred_branches) ? inquiry.preferred_branches.join(', ') : inquiry.preferred_branches || 'N/A',
        'Required Skills / Stack': skillsList.join(', ') || 'N/A',
        'Additional Info': inquiry.additional_info || 'N/A',
        'Status': inquiry.status || 'new',
        'Submitted At': inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : 'N/A'
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruitment Inquiries')
    XLSX.writeFile(workbook, `SIET_Company_Inquiries_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Helper to extract skills array safely
  const getSkillsList = (inquiry) => {
    if (Array.isArray(inquiry.required_skills) && inquiry.required_skills.length > 0) {
      return inquiry.required_skills
    }
    if (typeof inquiry.required_skills === 'string' && inquiry.required_skills.trim()) {
      return inquiry.required_skills.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (inquiry.additional_info && inquiry.additional_info.includes('Required Skills / Stack:')) {
      const match = inquiry.additional_info.match(/Required Skills \/ Stack:\s*(.*)/)
      if (match && match[1]) {
        return match[1].split(',').map(s => s.trim()).filter(Boolean)
      }
    }
    return []
  }

  // Branch statistics mapping
  const branchStats = {
    "Computer Science and Engineering (Core)": students.filter(s => s.branch === "Computer Science and Engineering (Core)").length,
    "CSE (AI & ML)": students.filter(s => s.branch === "CSE (AI & ML)").length,
    "CSE (Cyber Security)": students.filter(s => s.branch === "CSE (Cyber Security)").length,
    "Robotics & Automation": students.filter(s => s.branch === "Robotics & Automation").length,
    "Electrical Engineering": students.filter(s => s.branch === "Electrical Engineering").length,
    "Electronics Engineering (VLSI Design)": students.filter(s => s.branch === "Electronics Engineering (VLSI Design)").length,
  }

  // Format data for recharts PieChart
  const pieData = Object.entries(branchStats)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)

  const COLORS = ['#0A1628', '#C9922A', '#1E3A8A', '#3B82F6', '#10B981', '#6366F1']

  const totalPositionsRequested = inquiries.reduce((acc, curr) => acc + (Number(curr.positions) || 0), 0)

  if (loading) {
    return (
      <div className="login-page" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '4px solid var(--gold)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p className="db-label">Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="login-page" style={{ flexDirection: 'column', background: 'var(--parchment)', minHeight: '100vh' }}>
      
      {/* Top Navbar */}
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
              Admin Portal
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
              TPO Administrator
            </p>
            <p className="db-status" style={{ margin: 0 }}>
              <span className="db-status-dot" /> Online
            </p>
          </div>
          <button 
            onClick={handleLogout}
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

      {/* Main Content */}
      <main className="db-container animate-fade-up">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '42rem' }}>
            <h2 className="section-title" style={{ textAlign: 'left', color: 'var(--ink)', marginBottom: '0.5rem' }}>Training &amp; Placement Office</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', color: 'var(--muted-foreground)', margin: 0 }}>
              Overview of student applications, company recruitment inquiries, and required tech stacks.
            </p>
          </div>
          
          <button
            onClick={activeTab === 'students' ? handleExportStudents : handleExportInquiries}
            className="db-btn-next"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} /> 
            {activeTab === 'students' ? 'Export Student Roster' : 'Export Company Inquiries'}
          </button>
        </div>

        {/* Submenu Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '2px solid rgba(10,22,40,0.1)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.5rem',
              background: activeTab === 'students' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'students' ? 'var(--parchment)' : 'var(--ink)',
              border: 'none',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              fontWeight: '700',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'students' ? '0 -2px 10px rgba(10,22,40,0.1)' : 'none'
            }}
          >
            <Users style={{ width: '1.1rem', height: '1.1rem', color: activeTab === 'students' ? 'var(--gold)' : 'inherit' }} />
            Student Profiles & Roster
            <span style={{
              background: activeTab === 'students' ? 'var(--gold)' : 'rgba(10,22,40,0.08)',
              color: activeTab === 'students' ? 'var(--ink)' : 'var(--ink)',
              padding: '0.15rem 0.5rem',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '800'
            }}>
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.5rem',
              background: activeTab === 'inquiries' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'inquiries' ? 'var(--parchment)' : 'var(--ink)',
              border: 'none',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              fontWeight: '700',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'inquiries' ? '0 -2px 10px rgba(10,22,40,0.1)' : 'none'
            }}
          >
            <Building2 style={{ width: '1.1rem', height: '1.1rem', color: activeTab === 'inquiries' ? 'var(--gold)' : 'inherit' }} />
            Company Requirements & Inquiries
            <span style={{
              background: activeTab === 'inquiries' ? 'var(--gold)' : 'rgba(10,22,40,0.08)',
              color: activeTab === 'inquiries' ? 'var(--ink)' : 'var(--ink)',
              padding: '0.15rem 0.5rem',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '800'
            }}>
              {inquiries.length}
            </span>
          </button>
        </div>

        {/* TAB 1: STUDENT PROFILES & ROSTER */}
        {activeTab === 'students' && (
          <>
            {/* Quick Stats Grid */}
            <div className="db-stat-grid">
              {[
                { label: "Total Students", val: stats.total, icon: Users, class: "stat-blue" },
                { label: "Eligible Profiles", val: stats.eligible, icon: CheckCircle, class: "stat-emerald" },
                { label: "Pending Verification", val: stats.pending, icon: Activity, class: "stat-amber" },
                { label: "Placed Candidates", val: stats.placed, icon: CheckCircle, class: "stat-indigo" },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="db-stat-card">
                    <div className={`db-stat-icon-wrap ${stat.class}`}>
                      <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                    <div>
                      <div className="db-stat-val">{stat.val}</div>
                      <span className="db-stat-label">{stat.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Vertical Stack Layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Branch Distribution Panel */}
              <div className="db-card">
                <h3 className="db-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Branch Distribution</h3>
                <p className="db-label" style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: '1.5rem' }}>Real-time student registry breakdown</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                  {/* Counts bar chart on the left */}
                  <div className="db-bars-container" style={{ marginTop: 0 }}>
                    {Object.entries(branchStats).map(([branch, count]) => {
                      const max = Math.max(...Object.values(branchStats)) || 1
                      const pct = (count / max) * 100
                      return (
                        <div key={branch} className="db-bar-item">
                          <div className="db-bar-info">
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '18rem' }} title={branch}>{branch}</span>
                            <span className="db-bar-count">{count}</span>
                          </div>
                          <div className="db-bar-track">
                            <div 
                              className="db-bar-fill" 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* recharts PieChart on the right */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: isMobile ? '340px' : '260px' }}>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 45 : 60}
                            outerRadius={isMobile ? 75 : 90}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              background: 'var(--surface-container-lowest)', 
                              border: '1px solid rgba(10,22,40,0.1)',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.8rem',
                              borderRadius: '4px'
                            }} 
                          />
                          <Legend 
                            layout={isMobile ? "horizontal" : "vertical"} 
                            verticalAlign={isMobile ? "bottom" : "middle"} 
                            align={isMobile ? "center" : "right"}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ 
                              fontFamily: 'var(--font-body)', 
                              fontSize: '0.7rem',
                              color: 'var(--ink)',
                              paddingTop: isMobile ? '1rem' : 0
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', opacity: 0.6 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>No distribution data to show.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Panel */}
              <div className="db-card" style={{ overflow: 'hidden' }}>
                
                <div className="db-filters">
                  <h3 className="db-card-title" style={{ fontSize: '1.25rem', margin: 0 }}>Candidate Roster</h3>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    <div className="db-search">
                      <Search className="db-search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="db-search-input"
                      />
                    </div>

                    <select
                      value={branchFilter}
                      onChange={(e) => setBranchFilter(e.target.value)}
                      className="db-select-filter"
                      style={{ maxWidth: '15rem' }}
                    >
                      <option value="">All Branches</option>
                      <option value="Computer Science and Engineering (Core)">Computer Science and Engineering (Core)</option>
                      <option value="CSE (AI & ML)">CSE (AI & ML)</option>
                      <option value="CSE (Cyber Security)">CSE (Cyber Security)</option>
                      <option value="Robotics & Automation">Robotics & Automation</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Electronics Engineering (VLSI Design)">Electronics Engineering (VLSI Design)</option>
                    </select>
                  </div>
                </div>

                {!isMobile ? (
                  <div className="db-table-wrapper" style={{ margin: 0, padding: 0 }}>
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th className="db-th" style={{ minWidth: '110px' }}>Roll No.</th>
                          <th className="db-th" style={{ minWidth: '150px' }}>Candidate</th>
                          <th className="db-th" style={{ minWidth: '190px' }}>Contact Info</th>
                          <th className="db-th" style={{ minWidth: '160px' }}>Academic Branch</th>
                          <th className="db-th" style={{ minWidth: '120px' }}>CGPA / Backlogs</th>
                          <th className="db-th" style={{ minWidth: '110px' }}>Status</th>
                          <th className="db-th" style={{ textAlign: 'right', minWidth: '230px', whiteSpace: 'nowrap' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => {
                            let badgeModifier = ""
                            let label = student.verification_status || "seeking"

                            if (label === "placed") {
                              badgeModifier = "badge-placed"
                            } else if (label === "seeking") {
                              badgeModifier = "badge-seeking"
                            } else if (label === "eligible") {
                              badgeModifier = "badge-eligible"
                            } else if (label === "not-eligible") {
                              badgeModifier = "badge-not-eligible"
                            }

                            return (
                              <tr key={student.id} className="db-tr">
                                <td className="db-td db-td-roll">{student.roll_number}</td>
                                <td className="db-td">
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="db-td-name" style={{ display: 'block' }}>{student.full_name}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'block', marginTop: '0.15rem' }}>
                                      F: {student.father_name || 'N/A'} · M: {student.mother_name || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td className="db-td" style={{ wordBreak: 'break-all' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'block', wordBreak: 'break-all', fontWeight: '600' }}>{student.email || 'N/A'}</span>
                                    <span style={{ color: 'var(--muted-foreground)', display: 'block', marginTop: '0.1rem' }}>{student.mobile_number || 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="db-td db-td-branch">{student.branch}</td>
                                <td className="db-td">
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="db-td-cgpa" style={{ display: 'block' }}>{student.cgpa}</span>
                                    <span style={{ fontSize: '0.7rem', color: student.backlogs === "No backlogs" ? '#16a34a' : '#dc2626', display: 'block', marginTop: '0.15rem' }}>
                                      {student.backlogs}
                                    </span>
                                  </div>
                                </td>
                                <td className="db-td">
                                  <span className={`db-badge ${badgeModifier}`}>
                                    {label}
                                  </span>
                                </td>
                                <td className="db-td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                  <div className="db-actions" style={{ flexWrap: 'nowrap', justifyContent: 'flex-end' }}>
                                    <button
                                      type="button"
                                      onClick={() => setInspectingStudent(student)}
                                      className="db-action-btn"
                                      style={{ background: 'var(--ink)', color: 'var(--gold)', borderColor: 'var(--gold)', gap: '0.4rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: '800', whiteSpace: 'nowrap', flexShrink: 0 }}
                                      title="Inspect Student Documents & Profile"
                                    >
                                      <Eye style={{ width: '0.88rem', height: '0.88rem', flexShrink: 0 }} /> Inspect Files
                                    </button>
                                    {student.resume_url && (
                                      <a href={student.resume_url} target="_blank" rel="noopener noreferrer" className="db-action-btn" title="View CV / Resume">
                                        <FileText style={{ width: '0.875rem', height: '0.875rem', color: 'var(--gold)' }} />
                                      </a>
                                    )}
                                    {student.linkedin_url && (
                                      <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="db-action-btn" title="View LinkedIn">
                                        <ExternalLink style={{ width: '0.875rem', height: '0.875rem' }} />
                                      </a>
                                    )}
                                    <button 
                                      onClick={() => handleDeleteStudent(student.id)} 
                                      className="db-action-btn btn-delete"
                                      title="Delete Profile"
                                    >
                                      <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="db-td" style={{ textAlign: 'center', padding: '3.5rem 0' }}>
                              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', opacity: 0.6 }}>
                                <FileSpreadsheet style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
                                <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>No candidates found.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Mobile View: Cards Stack */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        let badgeModifier = ""
                        let label = student.verification_status || "seeking"

                        if (label === "placed") {
                          badgeModifier = "badge-placed"
                        } else if (label === "seeking") {
                          badgeModifier = "badge-seeking"
                        } else if (label === "eligible") {
                          badgeModifier = "badge-eligible"
                        } else if (label === "not-eligible") {
                          badgeModifier = "badge-not-eligible"
                        }

                        return (
                          <div 
                            key={student.id} 
                            style={{ 
                              padding: '1.25rem', 
                              background: 'rgba(255, 255, 255, 0.4)', 
                              border: '1px solid rgba(10,22,40,0.06)', 
                              borderRadius: '4px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.85rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-foreground)' }}>{student.roll_number}</span>
                              <span className={`db-badge ${badgeModifier}`}>{label}</span>
                            </div>

                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--ink)' }}>{student.full_name}</h4>
                              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
                                Father: {student.father_name || 'N/A'} · Mother: {student.mother_name || 'N/A'}
                              </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem', background: 'var(--surface-container-low)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontSize: '0.75rem', textAlign: 'left' }}>
                              <div>
                                <span style={{ color: 'var(--muted-foreground)', display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>Branch</span>
                                <strong style={{ color: 'var(--ink)' }}>{student.branch}</strong>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ color: 'var(--muted-foreground)', display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.15rem' }}>CGPA</span>
                                <strong style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>{student.cgpa}</strong>
                                <span style={{ fontSize: '0.65rem', color: student.backlogs === "No backlogs" ? '#16a34a' : '#dc2626', display: 'block', marginTop: '0.15rem' }}>
                                  {student.backlogs}
                                </span>
                              </div>
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'grid', gap: '0.3rem', borderTop: '1px solid rgba(10,22,40,0.04)', paddingTop: '0.6rem', textAlign: 'left' }}>
                              <div>📧 {student.email || 'N/A'}</div>
                              <div>📞 {student.mobile_number || 'N/A'}</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(10,22,40,0.04)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                              {student.linkedin_url && (
                                <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', textDecoration: 'none' }}>
                                  <ExternalLink style={{ width: '0.8rem', height: '0.8rem' }} /> Profile
                                </a>
                              )}
                              <button 
                                onClick={() => handleDeleteStudent(student.id)} 
                                style={{ background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#dc2626', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                <Trash2 style={{ width: '0.8rem', height: '0.8rem' }} /> Delete
                              </button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted-foreground)', opacity: 0.6 }}>
                        <FileSpreadsheet style={{ width: '3rem', height: '3rem', marginBottom: '1rem', opacity: 0.2, margin: '0 auto' }} />
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>No candidates found.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: COMPANY REQUIREMENTS & INQUIRIES */}
        {activeTab === 'inquiries' && (
          <>
            {/* Quick Stats Grid */}
            <div className="db-stat-grid" style={{ marginBottom: '2.5rem' }}>
              {[
                { label: "Total Recruiter Inquiries", val: inquiries.length, icon: Building2, class: "stat-blue" },
                { label: "Total Vacancies Offered", val: totalPositionsRequested, icon: Briefcase, class: "stat-emerald" },
                { label: "IT & Software Inquiries", val: inquiries.filter(i => i.industry === "IT & Software").length, icon: Code, class: "stat-indigo" },
                { label: "Other Industries", val: inquiries.filter(i => i.industry !== "IT & Software").length, icon: Layers, class: "stat-amber" },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="db-stat-card">
                    <div className={`db-stat-icon-wrap ${stat.class}`}>
                      <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </div>
                    <div>
                      <div className="db-stat-val">{stat.val}</div>
                      <span className="db-stat-label">{stat.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Main Inquiries Card Stack */}
            <div className="db-card" style={{ overflow: 'hidden' }}>
              
              <div className="db-filters" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="db-card-title" style={{ fontSize: '1.25rem', margin: 0 }}>Recruitment Requirements</h3>
                  <p className="db-label" style={{ color: 'var(--muted-foreground)', display: 'block', marginTop: '0.2rem' }}>Company profiles, job roles, and required tech stacks</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                  <div className="db-search">
                    <Search className="db-search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search company, role, skill..."
                      value={inquirySearchTerm}
                      onChange={(e) => setInquirySearchTerm(e.target.value)}
                      className="db-search-input"
                    />
                  </div>

                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="db-select-filter"
                    style={{ maxWidth: '15rem' }}
                  >
                    <option value="">All Sectors</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Inquiry List Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inquiry) => {
                    const skills = getSkillsList(inquiry)
                    const branches = Array.isArray(inquiry.preferred_branches) ? inquiry.preferred_branches : []

                    return (
                      <div 
                        key={inquiry.id}
                        style={{
                          background: '#fff',
                          border: '1px solid rgba(10,22,40,0.1)',
                          borderRadius: '6px',
                          padding: '1.5rem',
                          boxShadow: '0 4px 14px rgba(10,22,40,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem'
                        }}
                      >
                        {/* Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(10,22,40,0.06)', paddingBottom: '1rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                              <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)' }}>
                                {inquiry.company_name}
                              </h4>
                              {inquiry.website && (
                                <a 
                                  href={inquiry.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}
                                >
                                  <ExternalLink style={{ width: '0.8rem', height: '0.8rem' }} /> Website
                                </a>
                              )}
                              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(201,146,42,0.1)', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                                {inquiry.industry || 'General Industry'}
                              </span>
                              {inquiry.company_size && (
                                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(10,22,40,0.06)', color: 'var(--muted-foreground)', fontWeight: '600' }}>
                                  🏢 {inquiry.company_size}
                                </span>
                              )}
                            </div>
                            
                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                              Submitted on {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block', fontWeight: '700', letterSpacing: '0.05em' }}>Required Role</span>
                              <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>{inquiry.job_role}</strong>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700' }}>{inquiry.positions} Position{inquiry.positions > 1 ? 's' : ''}</span>
                            </div>

                            <button
                              onClick={() => handleDeleteInquiry(inquiry.id)}
                              className="db-action-btn btn-delete"
                              style={{ width: '2.25rem', height: '2.25rem' }}
                              title="Delete Inquiry"
                            >
                              <Trash2 style={{ width: '1rem', height: '1rem' }} />
                            </button>
                          </div>
                        </div>

                        {/* Middle Grid: Contact details & Requirements */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                          {/* Contact Person Card */}
                          <div style={{ background: 'var(--surface-container-low)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(10,22,40,0.06)' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                              Contact Person
                            </span>
                            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '0.2rem' }}>
                              {inquiry.contact_name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: '600', marginBottom: '0.6rem' }}>
                              {inquiry.designation}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--ink)' }}>
                              <a href={`mailto:${inquiry.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ink)', textDecoration: 'none' }}>
                                <Mail style={{ width: '0.85rem', height: '0.85rem', color: 'var(--gold)' }} /> {inquiry.email}
                              </a>
                              <a href={`tel:${inquiry.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ink)', textDecoration: 'none' }}>
                                <Phone style={{ width: '0.85rem', height: '0.85rem', color: 'var(--gold)' }} /> {inquiry.phone}
                              </a>
                            </div>
                          </div>

                          {/* Preferred Branches */}
                          <div style={{ background: 'var(--surface-container-low)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(10,22,40,0.06)' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                              Target Branches
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {branches.length > 0 ? (
                                branches.map((b, idx) => (
                                  <span 
                                    key={idx}
                                    style={{
                                      padding: '0.3rem 0.65rem',
                                      background: '#fff',
                                      border: '1px solid rgba(10,22,40,0.12)',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      color: 'var(--ink)'
                                    }}
                                  >
                                    {b}
                                  </span>
                                ))
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>All Branches / Open</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Required Stack & Skills Boxed Section */}
                        {skills.length > 0 && (
                          <div style={{ background: 'rgba(201,146,42,0.04)', padding: '1rem', borderRadius: '4px', border: '1px dashed rgba(201,146,42,0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                              <Code style={{ width: '1rem', height: '1rem', color: 'var(--gold)' }} />
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--ink)', letterSpacing: '0.08em' }}>
                                Required Skills & Tech Stack
                              </span>
                            </div>
                            <div className="skill-chips" style={{ margin: 0, gap: '0.5rem' }}>
                              {skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '0.4rem 0.8rem',
                                    border: '1px solid rgba(201,146,42,0.4)',
                                    background: '#fff',
                                    color: 'var(--ink)',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(10,22,40,0.03)'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Information */}
                        {inquiry.additional_info && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', background: 'var(--surface-container-low)', padding: '0.85rem 1rem', borderRadius: '4px', borderLeft: '3px solid var(--gold)' }}>
                            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.2rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Additional Notes / Criteria:
                            </strong>
                            <p style={{ margin: 0, whitespace: 'pre-wrap', lineHeight: '1.5' }}>
                              {inquiry.additional_info}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted-foreground)', opacity: 0.6 }}>
                    <Building2 style={{ width: '3.5rem', height: '3.5rem', marginBottom: '1rem', opacity: 0.2, margin: '0 auto' }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0 }}>No company recruitment inquiries found.</p>
                    <small>When companies complete the recruitment form, their submissions will appear here.</small>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </main>

      {/* DOCUMENT INSPECTION MODAL */}
      {inspectingStudent && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,22,40,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setInspectingStudent(null)}
        >
          <div 
            style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid rgba(201,146,42,0.35)',
              borderRadius: '8px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(10,22,40,0.35)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(10,22,40,0.1)', paddingBottom: '1.25rem', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {inspectingStudent.photo_url ? (
                  <img 
                    src={inspectingStudent.photo_url} 
                    alt={inspectingStudent.full_name} 
                    style={{ width: '72px', height: '72px', borderRadius: '6px', objectFit: 'cover', border: '2px solid var(--gold)', boxShadow: '0 4px 12px rgba(10,22,40,0.15)' }} 
                  />
                ) : (
                  <div style={{ width: '72px', height: '72px', borderRadius: '6px', background: 'var(--ink)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.65rem' }}>
                    {inspectingStudent.full_name?.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', margin: 0, color: 'var(--ink)' }}>{inspectingStudent.full_name}</h2>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Roll: {inspectingStudent.roll_number} · {inspectingStudent.branch}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    F: {inspectingStudent.father_name || 'N/A'} · M: {inspectingStudent.mother_name || 'N/A'}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setInspectingStudent(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--muted-foreground)' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Profile Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--surface-container-low)', borderLeft: '3px solid var(--gold)', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block' }}>B.Tech CGPA</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--ink)' }}>{inspectingStudent.cgpa || 'N/A'}</strong>
              </div>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--surface-container-low)', borderLeft: '3px solid var(--ink)', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block' }}>10th / 12th %</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{inspectingStudent.percentage_10 ? `${inspectingStudent.percentage_10}%` : 'N/A'} / {inspectingStudent.percentage_12 ? `${inspectingStudent.percentage_12}%` : 'N/A'}</strong>
              </div>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--surface-container-low)', borderLeft: '3px solid #16a34a', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block' }}>Backlogs</span>
                <strong style={{ fontSize: '0.95rem', color: inspectingStudent.backlogs === 'No backlogs' ? '#16a34a' : '#dc2626' }}>{inspectingStudent.backlogs || 'No backlogs'}</strong>
              </div>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--surface-container-low)', borderLeft: '3px solid #3b82f6', borderRadius: '4px', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted-foreground)', display: 'block' }}>Mobile & Email</span>
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)', display: 'block' }}>{inspectingStudent.mobile_number}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'block', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{inspectingStudent.email}</span>
              </div>
            </div>

            {/* UPLOADED DOCUMENTS & FILES SECTION */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} style={{ color: 'var(--gold)' }} />
                Uploaded Student Files & Transcripts
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                {/* Resume Card */}
                <div style={{ padding: '1rem', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '6px', background: inspectingStudent.resume_url ? 'rgba(201,146,42,0.06)' : 'var(--surface-container-low)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>CV / Resume (PDF)</strong>
                    {inspectingStudent.resume_url ? <CheckCircle style={{ color: '#16a34a', width: '16px', height: '16px' }} /> : <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>Not uploaded</span>}
                  </div>
                  {inspectingStudent.resume_url ? (
                    <a 
                      href={inspectingStudent.resume_url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', background: 'var(--gold)', color: 'var(--ink)', fontWeight: '800', fontSize: '0.78rem', borderRadius: '4px', textDecoration: 'none', marginTop: '0.35rem' }}
                    >
                      <ExternalLink size={14} /> Open & Download CV
                    </a>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>No resume uploaded yet.</p>
                  )}
                </div>

                {/* Marksheet Card */}
                <div style={{ padding: '1rem', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '6px', background: inspectingStudent.marksheet_url ? 'rgba(201,146,42,0.06)' : 'var(--surface-container-low)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Latest Marksheet</strong>
                    {inspectingStudent.marksheet_url ? <CheckCircle style={{ color: '#16a34a', width: '16px', height: '16px' }} /> : <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>Not uploaded</span>}
                  </div>
                  {inspectingStudent.marksheet_url ? (
                    <a 
                      href={inspectingStudent.marksheet_url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', background: 'var(--ink)', color: 'var(--parchment)', fontWeight: '800', fontSize: '0.78rem', borderRadius: '4px', textDecoration: 'none', marginTop: '0.35rem' }}
                    >
                      <ExternalLink size={14} /> View Marksheet
                    </a>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>No marksheet uploaded yet.</p>
                  )}
                </div>

                {/* Photo Card */}
                <div style={{ padding: '1rem', border: '1px solid rgba(10,22,40,0.12)', borderRadius: '6px', background: inspectingStudent.photo_url ? 'rgba(201,146,42,0.06)' : 'var(--surface-container-low)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Professional Photo</strong>
                    {inspectingStudent.photo_url ? <CheckCircle style={{ color: '#16a34a', width: '16px', height: '16px' }} /> : <span style={{ fontSize: '0.7rem', color: '#dc2626' }}>Not uploaded</span>}
                  </div>
                  {inspectingStudent.photo_url ? (
                    <a 
                      href={inspectingStudent.photo_url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', background: 'var(--surface-container-high)', color: 'var(--ink)', fontWeight: '800', fontSize: '0.78rem', borderRadius: '4px', textDecoration: 'none', marginTop: '0.35rem' }}
                    >
                      <ImagePlus size={14} /> View Full Photo
                    </a>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>No photo uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Document Vault Records */}
              {vaultDocuments.filter(d => d.uid === inspectingStudent.id || d.email === inspectingStudent.email).length > 0 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', display: 'block', marginBottom: '0.5rem' }}>
                    Document Vault Records ({vaultDocuments.filter(d => d.uid === inspectingStudent.id || d.email === inspectingStudent.email).length})
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {vaultDocuments.filter(d => d.uid === inspectingStudent.id || d.email === inspectingStudent.email).map(vDoc => (
                      <div key={vDoc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--surface-container-low)', borderRadius: '4px', border: '1px solid rgba(10,22,40,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={15} style={{ color: 'var(--gold)' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{vDoc.name || vDoc.type}</span>
                        </div>
                        <a href={vDoc.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ExternalLink size={13} /> View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Status Controls */}
            <div style={{ borderTop: '1px solid rgba(10,22,40,0.1)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', display: 'block', marginBottom: '0.4rem' }}>Update TPO Verification Status</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['seeking', 'eligible', 'placed', 'not-eligible'].map(statusOpt => (
                    <button
                      key={statusOpt}
                      type="button"
                      onClick={() => handleUpdateStudentStatus(inspectingStudent.id, statusOpt)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        border: inspectingStudent.verification_status === statusOpt ? '2px solid var(--gold)' : '1px solid rgba(10,22,40,0.15)',
                        background: inspectingStudent.verification_status === statusOpt ? 'var(--gold)' : 'var(--surface-container-low)',
                        color: inspectingStudent.verification_status === statusOpt ? 'var(--ink)' : 'var(--muted-foreground)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {statusOpt}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setInspectingStudent(null)}
                style={{ padding: '0.6rem 1.35rem', background: 'var(--ink)', color: 'var(--parchment)', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
