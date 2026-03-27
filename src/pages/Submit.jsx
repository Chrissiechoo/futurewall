import { useState, useEffect, useRef } from 'react'
import { db, storage } from '../firebase'
import {
  collection, addDoc, query, where, orderBy,
  onSnapshot, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'

// ─── Group passcode → group info ──────────────────────────────────────────────
const GROUP_CODES = {
  'JJJJJJ': { id: 'grp01', number: '01', client: 'Trifactor Travel',       campaign: 'Reclaim Your Travel Freedom' },
  'T73FBP': { id: 'grp02', number: '02', client: 'Action Buddy',            campaign: 'The First Step To Fixing Is Seeing' },
  '6N6N6N': { id: 'grp03', number: '03', client: 'Earth in Focus',          campaign: 'Gap = Agency' },
  'WEWEWE': { id: 'grp04', number: '04', client: 'Trifactor Nutrition',     campaign: 'This Used To Be Easy' },
  'ULC4UL': { id: 'grp05', number: '05', client: 'Bixeps Athletes',         campaign: 'Engineered to Outperform' },
  '9VZMRD': { id: 'grp06', number: '06', client: 'Ten Square × PlayPan',    campaign: 'The City Is a Conversation' },
  'H59VZM': { id: 'grp07', number: '07', client: 'Bixeps Seniors',          campaign: 'Extending Human Healthspan' },
  'VZMRDH': { id: 'grp08', number: '08', client: '14 Days / Dementia SG',   campaign: 'The Glitch' },
  'N6N6N6': { id: 'grp09', number: '09', client: 'C4AIL / LAIS',            campaign: 'AI Matures Through Better Leadership' },
}

// ─── Six submission categories ────────────────────────────────────────────────
const SUBMISSION_TYPES = [
  {
    id: 'billboard',
    number: '01',
    label: 'Billboard Content',
    sublabel: 'Silent · 15–30 sec · QR integrated',
    description: 'Upload your silent billboard video(s), 15–30 seconds each, designed for the Ten Square Super-Billboard. QR code should be integrated. Multiple versions welcome.',
    acceptFiles: 'video/mp4,video/quicktime,video/webm',
    acceptLabel: 'MP4, MOV, WEBM',
    urlPlaceholder: 'YouTube, Vimeo, or Google Drive link…',
    optional: false,
    lecturerNote: null,
  },
  {
    id: 'social',
    number: '02',
    label: 'Social Media Content',
    sublabel: 'Reels · TikTok · LinkedIn · with QR',
    description: 'Matching social media content with QR code integration. Upload video or image files, or paste links to live/draft posts (Instagram Reels, TikTok, LinkedIn, etc.).',
    acceptFiles: 'video/mp4,video/quicktime,image/jpeg,image/png,image/webp',
    acceptLabel: 'MP4, MOV, JPG, PNG',
    urlPlaceholder: 'Instagram, TikTok, LinkedIn, or YouTube link…',
    optional: false,
    lecturerNote: null,
  },
  {
    id: 'platform',
    number: '03',
    label: 'Complementary Platform',
    sublabel: 'Website · App · Video series · Interactive',
    description: 'Your chosen platform based on the client brief — a website, video series, social media campaign, or interactive experience. Paste the live URL and/or upload supporting files.',
    acceptFiles: 'video/mp4,video/quicktime,image/jpeg,image/png,.pdf',
    acceptLabel: 'URL, MP4, PDF, JPG',
    urlPlaceholder: 'Live URL, Google Drive, or platform link…',
    optional: false,
    lecturerNote: null,
  },
  {
    id: 'handoff',
    number: '04',
    label: 'Client Handoff Package',
    sublabel: 'Usage guide · All files · Implementation recommendations',
    description: 'Complete handoff for your client: usage guide, all campaign files, and implementation recommendations. A Google Drive folder link works well here.',
    acceptFiles: '.pdf,.zip,.docx,.pptx',
    acceptLabel: 'PDF, ZIP, DOCX, PPTX',
    urlPlaceholder: 'Google Drive folder link…',
    optional: false,
    lecturerNote: null,
  },
  {
    id: 'deck',
    number: '05',
    label: 'Presentation Deck',
    sublabel: 'Final presentation slides',
    description: 'Your final campaign presentation slides. Upload as PDF or paste a Google Slides / Canva link.',
    acceptFiles: '.pdf,.pptx,.key',
    acceptLabel: 'PDF, PPTX, KEY',
    urlPlaceholder: 'Google Slides or Canva link…',
    optional: false,
    lecturerNote: null,
  },
  {
    id: 'presentation_video',
    number: '06',
    label: 'Presentation Video',
    sublabel: 'Optional · Can be uploaded by lecturer',
    description: 'Recording of your final presentation. Optional — your lecturer may upload this on your behalf with your group\'s agreement. You may also upload directly here.',
    acceptFiles: 'video/mp4,video/quicktime',
    acceptLabel: 'MP4, MOV',
    urlPlaceholder: 'YouTube, Vimeo, or Google Drive link…',
    optional: true,
    lecturerNote: 'Your lecturer will upload this with your agreement. You may also submit directly.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function fmtTime(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-SG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Single submitted item row ────────────────────────────────────────────────
function SubmittedItem({ item, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 6, marginBottom: 8,
    }}>
      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>
        {item.uploadType === 'url' ? '🔗' : '📄'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.label || (item.uploadType === 'url' ? item.url : item.filename)}
        </div>
        {item.label && item.uploadType === 'url' && (
          <div style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{item.url}</div>
        )}
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 3 }}>
          {item.uploadType === 'file' && item.fileSize ? fmtSize(item.fileSize) + ' · ' : ''}
          {fmtTime(item.timestamp)}
        </div>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '0.75rem', color: 'var(--cyan)', flexShrink: 0, marginTop: 2 }}
      >
        {item.uploadType === 'url' ? 'Open ↗' : 'View ↗'}
      </a>
      {confirming ? (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => onDelete(item)} style={{
            fontSize: '0.7rem', padding: '4px 8px',
            background: 'var(--red)', color: '#fff',
            border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>Remove</button>
          <button onClick={() => setConfirming(false)} style={{
            fontSize: '0.7rem', padding: '4px 8px', background: 'transparent',
            color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 4, cursor: 'pointer',
          }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setConfirming(true)} style={{
          background: 'none', border: 'none',
          color: 'var(--text-dim)', cursor: 'pointer',
          fontSize: '0.85rem', flexShrink: 0, marginTop: 1,
        }}>✕</button>
      )}
    </div>
  )
}

// ─── One submission section (billboard, social, etc.) ─────────────────────────
function SubmissionSection({ type, groupId }) {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [mode, setMode]         = useState(null)   // null | 'url' | 'file'
  const [urlVal, setUrlVal]     = useState('')
  const [labelVal, setLabelVal] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState('')
  const fileRef = useRef()

  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      where('groupId', '==', groupId),
      where('type', '==', type.id),
      orderBy('timestamp', 'asc'),
    )
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [groupId, type.id])

  const reset = () => { setMode(null); setUrlVal(''); setLabelVal(''); setError('') }

  const submitUrl = async () => {
    if (!urlVal.trim()) return
    setError('')
    try {
      await addDoc(collection(db, 'submissions'), {
        groupId, type: type.id, uploadType: 'url',
        url: urlVal.trim(), label: labelVal.trim(),
        timestamp: serverTimestamp(),
      })
      reset()
    } catch {
      setError('Could not save link. Please try again.')
    }
  }

  const submitFile = async file => {
    if (!file) return
    setUploading(true); setProgress(0); setError('')
    try {
      const path = `submissions/${groupId}/${type.id}/${Date.now()}_${file.name}`
      const task = uploadBytesResumable(ref(storage, path), file)
      task.on('state_changed',
        s => setProgress(Math.round(s.bytesTransferred / s.totalBytes * 100)),
        err => { setError('Upload failed: ' + err.message); setUploading(false) },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          await addDoc(collection(db, 'submissions'), {
            groupId, type: type.id, uploadType: 'file',
            url, filename: file.name, fileSize: file.size,
            storagePath: path, label: labelVal.trim(),
            timestamp: serverTimestamp(),
          })
          reset(); setUploading(false)
        },
      )
    } catch (e) {
      setError('Upload failed. ' + e.message); setUploading(false)
    }
  }

  const handleDelete = async item => {
    try {
      await deleteDoc(doc(db, 'submissions', item.id))
      if (item.storagePath) {
        try { await deleteObject(ref(storage, item.storagePath)) } catch {}
      }
    } catch { setError('Could not delete. Try again.') }
  }

  const hasItems = items.length > 0

  return (
    <div style={{
      border: `1px solid ${hasItems ? 'rgba(0,212,232,0.3)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 10, overflow: 'hidden', marginBottom: 14,
      transition: 'border-color 0.2s',
    }}>
      {/* Section header */}
      <div style={{
        padding: '14px 20px',
        background: hasItems ? 'rgba(0,212,232,0.05)' : 'rgba(255,255,255,0.02)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 6, flexShrink: 0,
          background: hasItems ? 'rgba(0,212,232,0.18)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace',
          color: hasItems ? 'var(--cyan)' : 'var(--text-dim)',
        }}>
          {hasItems ? '✓' : type.number}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
              {type.label}
            </span>
            {type.optional && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: 'var(--text-dim)',
                background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 999,
              }}>Optional</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {type.sublabel}
          </div>
        </div>
        {hasItems && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--cyan)',
            background: 'rgba(0,212,232,0.12)', padding: '3px 10px',
            borderRadius: 999, flexShrink: 0,
          }}>
            {items.length} file{items.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 20px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 14 }}>
          {type.description}
        </p>

        {/* Already submitted */}
        {!loading && items.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {items.map(item => <SubmittedItem key={item.id} item={item} onDelete={handleDelete} />)}
          </div>
        )}

        {/* Upload progress bar */}
        {uploading && (
          <div style={{ marginBottom: 14 }}>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.08)',
              borderRadius: 2, overflow: 'hidden', marginBottom: 6,
            }}>
              <div style={{
                height: '100%', background: 'var(--cyan)', borderRadius: 2,
                width: progress + '%', transition: 'width 0.25s',
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>Uploading… {progress}%</div>
          </div>
        )}

        {/* URL input */}
        {mode === 'url' && !uploading && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: 14, marginBottom: 12,
          }}>
            <input
              type="text"
              value={labelVal}
              onChange={e => setLabelVal(e.target.value)}
              placeholder='Label (optional — e.g. "Final version", "IG Reel")'
              style={inputStyle}
            />
            <input
              type="url"
              value={urlVal}
              onChange={e => setUrlVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitUrl()}
              placeholder={type.urlPlaceholder}
              style={{ ...inputStyle, marginBottom: 10 }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submitUrl} disabled={!urlVal.trim()} style={btnPrimary(!!urlVal.trim())}>
                Save link
              </button>
              <button onClick={reset} style={btnGhost}>Cancel</button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            fontSize: '0.8rem', color: 'var(--red)',
            background: 'rgba(255,68,34,0.1)', padding: '8px 12px',
            borderRadius: 5, marginBottom: 10,
          }}>{error}</div>
        )}

        {/* Add buttons */}
        {!uploading && mode !== 'url' && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => { setMode('url'); setError('') }} style={btnAdd}>
              🔗 Add a link
            </button>
            <button onClick={() => { setError(''); fileRef.current?.click() }} style={btnAdd}>
              ⬆ Upload file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={type.acceptFiles}
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) submitFile(e.target.files[0]); e.target.value = '' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: 4 }}>
              {type.acceptLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared mini-styles ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5,
  color: 'var(--text)', padding: '9px 12px', fontSize: '0.875rem',
  marginBottom: 8, boxSizing: 'border-box',
}

const btnPrimary = enabled => ({
  padding: '8px 18px', background: enabled ? 'var(--cyan)' : 'rgba(0,212,232,0.3)',
  color: enabled ? 'var(--bg)' : 'rgba(0,0,0,0.4)',
  border: 'none', borderRadius: 5,
  fontWeight: 700, fontSize: '0.8rem', cursor: enabled ? 'pointer' : 'not-allowed',
})

const btnGhost = {
  padding: '8px 14px', background: 'transparent',
  color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 5, fontSize: '0.8rem', cursor: 'pointer',
}

const btnAdd = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 6, color: 'var(--text-muted)',
  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
}

// ─── Progress header bar ──────────────────────────────────────────────────────
function ProgressBar({ groupId }) {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    const q = query(collection(db, 'submissions'), where('groupId', '==', groupId))
    return onSnapshot(q, snap => {
      const c = {}
      snap.docs.forEach(d => { const t = d.data().type; c[t] = (c[t] || 0) + 1 })
      setCounts(c)
    })
  }, [groupId])

  const required = SUBMISSION_TYPES.filter(t => !t.optional)
  const completed = required.filter(t => counts[t.id] > 0).length

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8, padding: '14px 18px', marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8,
        }}>
          Required sections complete — {completed} / {required.length}
        </div>
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.08)',
          borderRadius: 3, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3, transition: 'width 0.5s ease',
            background: completed === required.length ? '#44cc88' : 'var(--cyan)',
            width: `${(completed / required.length) * 100}%`,
          }} />
        </div>
      </div>
      {completed === required.length && (
        <div style={{
          fontSize: '0.8rem', fontWeight: 700, color: '#44cc88',
          background: 'rgba(68,204,136,0.1)', padding: '6px 14px',
          borderRadius: 999, flexShrink: 0,
        }}>All done ✓</div>
      )}
    </div>
  )
}

// ─── Passcode screen ──────────────────────────────────────────────────────────
function PasscodeScreen({ onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const attempt = () => {
    const key = code.trim().toUpperCase()
    const group = GROUP_CODES[key]
    if (group) { onSuccess(group) }
    else { setError('Incorrect passcode. Check with your lecturer.') }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '80px 16px',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 440,
      }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12,
        }}>DCM3001 · Campaign Asset Submission</div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 10 }}>
          Submit your<br />campaign assets
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.65 }}>
          Enter the group passcode from your peer review message to access your submission portal.
        </p>

        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: 8,
          }}>Group passcode</label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="e.g. JJJJJJ"
            maxLength={10}
            autoFocus
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${error ? 'var(--red)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 6, color: 'var(--text)',
              padding: '14px 16px', fontSize: '1.5rem',
              letterSpacing: '0.2em', fontFamily: 'monospace',
              fontWeight: 700, textTransform: 'uppercase', textAlign: 'center',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <div style={{
            fontSize: '0.8rem', color: 'var(--red)',
            background: 'rgba(255,68,34,0.1)', padding: '10px 14px',
            borderRadius: 6, marginBottom: 14,
          }}>{error}</div>
        )}

        <button onClick={attempt} style={{
          width: '100%', padding: '14px',
          background: 'var(--red)', color: '#fff', border: 'none',
          borderRadius: 6, fontWeight: 800, fontSize: '0.9rem',
          letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          Access portal →
        </button>

        <p style={{
          fontSize: '0.75rem', color: 'var(--text-dim)',
          textAlign: 'center', marginTop: 20, lineHeight: 1.5,
        }}>
          Your passcode is the same one used for peer review access.
        </p>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Submit() {
  const [group, setGroup] = useState(null)

  // Persist session
  useEffect(() => {
    const saved = sessionStorage.getItem('submitGroup')
    if (saved) { try { setGroup(JSON.parse(saved)) } catch {} }
  }, [])

  const handleSuccess = grp => {
    sessionStorage.setItem('submitGroup', JSON.stringify(grp))
    setGroup(grp)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('submitGroup')
    setGroup(null)
  }

  if (!group) return <div className="page"><PasscodeScreen onSuccess={handleSuccess} /></div>

  return (
    <div className="page" style={{ maxWidth: 780, margin: '0 auto', padding: '40px 20px 100px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', gap: 16, marginBottom: 6, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--red)', marginBottom: 6,
          }}>Campaign Asset Submission · DCM3001</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
            Group {group.number} · {group.client}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--cyan)', fontStyle: 'italic' }}>
            "{group.campaign}"
          </p>
        </div>
        <button onClick={handleLogout} style={{
          padding: '8px 16px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, color: 'var(--text-muted)',
          fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0,
        }}>Log out</button>
      </div>

      {/* Tip banner */}
      <div style={{
        background: 'rgba(0,212,232,0.06)', border: '1px solid rgba(0,212,232,0.18)',
        borderRadius: 8, padding: '12px 16px', margin: '20px 0',
        fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--cyan)' }}>Tip:</strong> For large video files, upload to Google Drive or YouTube first and paste the link here — faster and more reliable. You can submit multiple files per section. Everything auto-saves instantly.
      </div>

      {/* Progress */}
      <ProgressBar groupId={group.id} />

      {/* Six submission sections */}
      {SUBMISSION_TYPES.map(type => (
        <SubmissionSection key={type.id} type={type} groupId={group.id} />
      ))}

      {/* Footer note */}
      <div style={{
        marginTop: 20, padding: '14px 18px',
        background: 'rgba(255,176,32,0.06)',
        border: '1px solid rgba(255,176,32,0.2)',
        borderRadius: 8, fontSize: '0.8rem',
        color: 'var(--text-muted)', lineHeight: 1.65,
      }}>
        <strong style={{ color: 'var(--amber)' }}>Section 06 — Presentation Video:</strong> Your lecturer will upload the presentation recording with your group's agreement. You may also upload it directly here if you have the file.
      </div>
    </div>
  )
}
