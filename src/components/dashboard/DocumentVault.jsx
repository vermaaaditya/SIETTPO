import { useRef, useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { CheckCircle2, FileUp, ShieldCheck, FileText, ExternalLink } from "lucide-react"
import { auth, db } from "../../lib/firebase"

const types = ["marksheet", "id", "resume", "offer"]
const uploadEndpoint = "https://tpo.sietpanchkula.ac.in/api/upload-document.php"

export default function DocumentVault({ user, documents, onUploaded }) {
  const input = useRef()
  const [type, setType] = useState("marksheet")
  const [message, setMessage] = useState("")

  async function upload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    if (!/(pdf|jpeg|jpg|png)$/i.test(file.name) || file.size > 5 * 1024 * 1024) {
      setMessage("Use a PDF, JPG or PNG under 5 MB.")
      return
    }
    if (!auth?.currentUser || !db) {
      setMessage("Please sign in before uploading a document.")
      return
    }
    try {
      setMessage("Uploading…")
      const token = await auth.currentUser.getIdToken()
      const formData = new FormData()
      formData.append("document", file)
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const uploaded = await response.json()
      if (!response.ok) throw new Error(uploaded.error || "Upload failed")
      const payload = { uid: user.uid, type, name: file.name, fileUrl: uploaded.fileUrl, uploadedAt: serverTimestamp(), verifiedStatus: "Pending" }
      const record = await addDoc(collection(db, "documents"), payload)
      onUploaded({ id: record.id, ...payload })
      setMessage("Document uploaded for TPO verification.")
    } catch (error) {
      setMessage(error.message || "Upload failed. Please try again.")
    }
  }

  return (
    <div className="db-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span className="db-label" style={{ color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.72rem', display: 'block', marginBottom: '0.2rem' }}>
            Academic Records
          </span>
          <h3 className="db-card-title" style={{ fontSize: '1.35rem', margin: 0 }}>Document Vault</h3>
        </div>
        <ShieldCheck style={{ width: '1.75rem', height: '1.75rem', color: 'var(--gold)' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select 
          value={type} 
          onChange={e => setType(e.target.value)}
          className="db-select-filter"
          style={{ maxWidth: '12rem', padding: '0.5rem 0.85rem' }}
        >
          {types.map(item => (
            <option key={item} value={item}>
              {item === "id" ? "ID Proof" : `${item[0].toUpperCase()}${item.slice(1)}`}
            </option>
          ))}
        </select>

        <button 
          onClick={() => input.current?.click()}
          className="db-btn-next"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <FileUp size={15} /> Upload Document
        </button>

        <input ref={input} onChange={upload} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden />
      </div>

      {message && (
        <p className="db-label" style={{ color: 'var(--gold)', marginBottom: '1rem', fontWeight: '700' }}>
          {message}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {documents.length ? documents.map(item => (
          <a 
            key={item.id} 
            href={item.fileUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1.1rem',
              background: 'var(--surface-container-low)',
              border: '1px solid rgba(10,22,40,0.06)',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <FileText size={16} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--ink)' }}>
                {item.name || `${item.type} document`}
              </span>
            </div>

            <span className={`db-badge ${item.verifiedStatus === "Verified by TPO" ? "badge-placed" : "badge-seeking"}`}>
              {item.verifiedStatus === "Verified by TPO" && <CheckCircle2 size={12} />} {item.verifiedStatus || "Pending"}
            </span>
          </a>
        )) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
            No verified documents uploaded yet.
          </p>
        )}
      </div>
    </div>
  )
}
