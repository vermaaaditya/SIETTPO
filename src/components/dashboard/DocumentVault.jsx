import { useRef, useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { CheckCircle2, FileUp, ShieldCheck } from "lucide-react"
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

  return <article className="portal-card vault"><div className="card-heading"><div><span>Secure records</span><h2>Document vault</h2></div><ShieldCheck color="var(--gold)" /></div><div className="upload-controls"><select value={type} onChange={e => setType(e.target.value)}>{types.map(item => <option key={item} value={item}>{item === "id" ? "ID proof" : `${item[0].toUpperCase()}${item.slice(1)}`}</option>)}</select><button onClick={() => input.current?.click()}><FileUp size={16} /> Upload document</button><input ref={input} onChange={upload} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden /></div>{message && <p className="upload-message">{message}</p>}<div className="document-list">{documents.length ? documents.map(item => <a key={item.id} href={item.fileUrl} target="_blank" rel="noreferrer"><span>{item.name || `${item.type} document`}</span><em className={item.verifiedStatus === "Verified by TPO" ? "verified" : "pending"}>{item.verifiedStatus === "Verified by TPO" && <CheckCircle2 size={13} />} {item.verifiedStatus || "Pending"}</em></a>) : <p className="empty-state">No documents uploaded yet.</p>}</div></article>
}
