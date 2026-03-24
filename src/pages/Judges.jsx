import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import content from '../data/content'

const { projects, judging } = content

function StarRating({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            fontSize: '1.5rem',
            color: star <= (hover || value) ? '#FFB020' : '#2A2A2E',
            transition: 'color 0.1s ease',
            padding: '2px 4px',
            lineHeight: 1,
          }}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span style={{ color: '#888', fontSize: '0.85rem', alignSelf: 'center', marginLeft: '4px' }}>
          {value}/{judging.scaleMax}
        </span>
      )}
    </div>
  )
}

function ProjectScoreCard({ project, scores, comments, onScoreChange, onCommentChange, disabled, isOpen, onToggle }) {
  // Total stars scored for this project
  const totalStars = judging.criteria.reduce((sum, c) => sum + (scores[c.id] || 0), 0)
  const maxStars = judging.criteria.length * 5
  const allScored = judging.criteria.every(c => (scores[c.id] || 0) > 0)

  return (
    <div style={{
      background: '#1C1C1E',
      border: `1px solid ${allScored ? 'rgba(255,176,32,0.35)' : '#2A2A2E'}`,
      borderRadius: '12px',
      marginBottom: '12px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* ---- Collapsed header — always visible ---- */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'left',
        }}
      >
        {/* Group number badge */}
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#00D4E8',
          background: 'rgba(0,212,232,0.08)',
          border: '1px solid rgba(0,212,232,0.2)',
          borderRadius: '4px',
          padding: '4px 8px',
          flexShrink: 0,
          letterSpacing: '0.08em',
        }}>
          GRP{String(project.groupNumber).padStart(2, '0')}
        </span>

        {/* Title block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 900,
            fontSize: '0.95rem',
            color: '#F0F0EE',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {project.campaignName}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '2px' }}>
            {project.client} · {project.themeLabel}
          </div>
        </div>

        {/* Star score summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontWeight: 900,
              fontSize: '1rem',
              color: allScored ? '#FFB020' : totalStars > 0 ? '#F0F0EE' : '#333',
              fontFamily: 'Space Mono, monospace',
            }}>
              {totalStars}<span style={{ color: '#333', fontSize: '0.8rem' }}>/{maxStars}</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {allScored ? '✓ scored' : totalStars > 0 ? 'partial' : 'not scored'}
            </div>
          </div>
          {/* Mini star display */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {judging.criteria.map(c => (
              <div key={c.id} style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: (scores[c.id] || 0) > 0 ? '#FFB020' : '#2A2A2E',
              }} />
            ))}
          </div>
          {/* Chevron */}
          <span style={{
            color: '#555',
            fontSize: '1rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            marginLeft: '4px',
          }}>▾</span>
        </div>
      </button>

      {/* ---- Expanded body ---- */}
      {isOpen && (
        <div style={{ padding: '0 24px 28px', borderTop: '1px solid #2A2A2E' }}>
          {/* Hook */}
          <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.5, padding: '16px 0 20px' }}>
            "{project.hook}"
          </p>

      {/* Full project details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'Big Idea', text: project.bigIdea },
          { label: 'Billboard Concept', text: project.billboardConcept },
          { label: 'Platform', text: project.platform },
          { label: 'QR Journey', text: project.qrJourney },
          { label: 'Target Audience', text: project.audience },
        ].map(item => (
          <div key={item.label}>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#00D4E8',
              marginBottom: '4px',
            }}>
              {item.label}
            </div>
            <p style={{ color: '#F0F0EE', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.text}</p>
          </div>
        ))}
        {project.teamNames && (
          <div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#00D4E8',
              marginBottom: '4px',
            }}>
              Team
            </div>
            <p style={{ color: '#888', fontSize: '0.88rem' }}>{project.teamNames}</p>
          </div>
        )}
      </div>

      {/* Video embed */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#00D4E8',
          marginBottom: '10px',
        }}>
          Billboard Preview
        </div>
        {project.billboardVideoUrl ? (
          <div style={{
            background: '#000',
            borderRadius: '8px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            maxWidth: '560px',
          }}>
            <iframe
              src={project.billboardVideoUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allowFullScreen
              title={`${project.campaignName} preview`}
            />
          </div>
        ) : (
          <div style={{
            background: '#0D0D0F',
            border: '1px dashed #2A2A2E',
            borderRadius: '8px',
            aspectRatio: '16/9',
            maxWidth: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ fontSize: '1.5rem' }}>▶</div>
            <div style={{ fontSize: '0.8rem' }}>Video coming soon</div>
          </div>
        )}
      </div>

      {/* Platform link */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#00D4E8',
          marginBottom: '8px',
        }}>
          Campaign Platform
        </div>
        {project.platformUrl ? (
          <a
            href={project.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#00D4E8',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'underline',
            }}
          >
            {project.platformUrl}
          </a>
        ) : (
          <span style={{ color: '#888', fontSize: '0.9rem' }}>Link coming soon</span>
        )}
      </div>

      {/* Scoring rubric */}
      <div style={{
        background: '#0D0D0F',
        border: '1px solid #2A2A2E',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#FFB020',
          marginBottom: '20px',
        }}>
          Scoring Rubric (1–5)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {judging.criteria.map(criterion => (
            <div key={criterion.id}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{
                    fontWeight: 700,
                    color: '#F0F0EE',
                    fontSize: '0.9rem',
                    marginBottom: '2px',
                  }}>
                    {criterion.label}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    {criterion.description}
                  </div>
                </div>
              </div>
              <StarRating
                value={scores[criterion.id] || 0}
                onChange={val => onScoreChange(project.id, criterion.id, val)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>

        {/* Comments */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2A2A2E' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#888',
            marginBottom: '8px',
          }}>
            Comments <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            value={comments}
            onChange={e => onCommentChange(project.id, e.target.value)}
            placeholder="Any notes, standout moments, or constructive feedback..."
            rows={3}
            disabled={disabled}
            className="form-input"
            style={{
              background: '#1C1C1E',
              color: '#F0F0EE',
              resize: 'vertical',
              opacity: disabled ? 0.6 : 1,
            }}
          />
        </div>
      </div>
        </div> {/* end expanded body */}
      )}
    </div>
  )
}

export default function Judges() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState('score')

  // Scores: { [groupId]: { [criterionId]: number } }
  const [scores, setScores] = useState({})
  // Comments: { [groupId]: string }
  const [comments, setComments] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  // Accordion: which project cards are open
  const [openCards, setOpenCards] = useState({})
  const toggleCard = (id) => setOpenCards(prev => ({ ...prev, [id]: !prev[id] }))

  // Leaderboard — always visible to judges
  const [votes, setVotes] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'votes'), snap => {
      const all = []
      snap.forEach(d => all.push(d.data()))
      setVotes(all)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setAuthLoading(false)
      if (u) {
        // Check if already submitted
        const docRef = doc(db, 'judgeScores', u.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setAlreadySubmitted(true)
        }
      }
    })
    return () => unsub()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error('Auth error:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setLoginError('Invalid email or password.')
      } else {
        setLoginError('Login failed. Please try again.')
      }
    } finally {
      setLoggingIn(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    setUser(null)
    setScores({})
    setComments({})
    setSubmitDone(false)
    setAlreadySubmitted(false)
  }

  const handleScoreChange = (groupId, criterionId, value) => {
    setScores(prev => ({
      ...prev,
      [groupId]: {
        ...(prev[groupId] || {}),
        [criterionId]: value,
      },
    }))
  }

  const handleCommentChange = (groupId, value) => {
    setComments(prev => ({ ...prev, [groupId]: value }))
  }

  const handleSubmitAll = async () => {
    if (!user) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const scoreData = {
        judgeUid: user.uid,
        judgeEmail: user.email,
        timestamp: serverTimestamp(),
        scores: {},
      }

      projects.forEach(p => {
        scoreData.scores[p.id] = {
          groupNumber: p.groupNumber,
          campaignName: p.campaignName,
          client: p.client,
          criteria: {},
          comments: comments[p.id] || '',
        }
        judging.criteria.forEach(c => {
          scoreData.scores[p.id].criteria[c.id] = scores[p.id]?.[c.id] || 0
        })
      })

      await setDoc(doc(db, 'judgeScores', user.uid), scoreData)
      setAlreadySubmitted(true)
      setSubmitDone(true)
    } catch (err) {
      console.error('Submit scores error:', err)
      setSubmitError('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate completion
  const totalCriteria = projects.length * judging.criteria.length
  const scoredCriteria = projects.reduce((acc, p) => {
    return acc + judging.criteria.filter(c => (scores[p.id]?.[c.id] || 0) > 0).length
  }, 0)
  const completionPct = Math.round((scoredCriteria / totalCriteria) * 100)

  if (authLoading) {
    return (
      <main style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ paddingTop: '64px', minHeight: '100vh', background: '#0D0D0F' }}>
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ maxWidth: '440px', margin: '0 auto' }}>
              <div className="section-eyebrow">Protected Area</div>
              <h1 style={{
                fontWeight: 900,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#F0F0EE',
                marginBottom: '8px',
              }}>
                Judges<br />
                <span style={{ color: '#FFB020' }}>Panel</span>
              </h1>
              <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '36px' }}>
                This area is restricted to registered judges. Please sign in with your provided credentials.
              </p>

              <form onSubmit={handleLogin} style={{
                background: '#1C1C1E',
                border: '1px solid #2A2A2E',
                borderRadius: '12px',
                padding: '32px',
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="judge-email">Email Address</label>
                  <input
                    id="judge-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="form-input"
                    style={{ background: '#0D0D0F', color: '#F0F0EE' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="judge-password">Password</label>
                  <input
                    id="judge-password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ background: '#0D0D0F', color: '#F0F0EE' }}
                  />
                </div>

                {loginError && (
                  <div style={{
                    background: 'rgba(255,68,34,0.1)',
                    border: '1px solid rgba(255,68,34,0.3)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#FF4422',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                  }}>
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="btn-red"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: loggingIn ? 0.6 : 1,
                    cursor: loggingIn ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loggingIn && <span className="spinner" style={{ width: '16px', height: '16px' }} />}
                  {loggingIn ? 'Signing in...' : 'Sign In to Judges Panel'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '64px', background: '#0D0D0F', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{
        background: '#1C1C1E',
        borderBottom: '1px solid #2A2A2E',
        padding: '24px 0',
        position: 'sticky',
        top: '64px',
        zIndex: 100,
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{
                fontWeight: 900,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#FFB020',
              }}>
                Judges Panel
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem' }}>{user.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Progress */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '4px' }}>
                  {scoredCriteria}/{totalCriteria} criteria scored
                </div>
                <div style={{
                  height: '4px',
                  width: '120px',
                  background: '#2A2A2E',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${completionPct}%`,
                    background: '#FFB020',
                    borderRadius: '2px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#888',
                  background: 'transparent',
                  border: '1px solid #2A2A2E',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F0F0EE'; e.currentTarget.style.borderColor = '#888' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2A2A2E' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #2A2A2E', background: '#0D0D0F' }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'score', label: 'Score Projects' },
            { id: 'leaderboard', label: '🗳 Leaderboard: Audience Vote' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 24px',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#FFB020' : '#555',
                borderBottom: `2px solid ${activeTab === tab.id ? '#FFB020' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main judges content */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          {activeTab === 'leaderboard' ? (
            /* ---- LIVE LEADERBOARD (always visible to judges) ---- */
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#FF4422', boxShadow: '0 0 10px #FF4422',
                  animation: 'spin 2s linear infinite', flexShrink: 0,
                  animationName: 'livePulse',
                }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FF4422' }}>
                  Live Audience Votes — {votes.length} cast
                </span>
              </div>
              {(() => {
                const tallied = projects.map(p => ({
                  project: p,
                  count: votes.filter(v => v.groupId === p.id).length,
                })).sort((a, b) => b.count - a.count)
                const maxVotes = Math.max(...tallied.map(t => t.count), 1)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tallied.map(({ project: p, count }, idx) => (
                      <div key={p.id} style={{
                        background: '#1C1C1E',
                        border: `1px solid ${idx === 0 && count > 0 ? 'rgba(255,176,32,0.4)' : '#2A2A2E'}`,
                        borderRadius: '8px',
                        padding: '16px 20px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00D4E8', marginRight: '8px', letterSpacing: '0.1em' }}>
                              GRP{String(p.groupNumber).padStart(2, '0')}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F0F0EE' }}>{p.campaignName}</span>
                            <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '2px' }}>{p.client}</div>
                          </div>
                          <div style={{ fontWeight: 900, fontSize: '1.4rem', color: idx === 0 && count > 0 ? '#FFB020' : '#F0F0EE', flexShrink: 0 }}>
                            {count}{idx === 0 && count > 0 && <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>★</span>}
                          </div>
                        </div>
                        <div style={{ height: '6px', background: '#2A2A2E', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(count / maxVotes) * 100}%`,
                            background: idx === 0 ? 'linear-gradient(90deg,#FFB020,#FF4422)' : '#00D4E8',
                            borderRadius: '3px',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          ) : submitDone || alreadySubmitted ? (
            <div style={{
              background: 'rgba(255,176,32,0.08)',
              border: '1px solid rgba(255,176,32,0.25)',
              borderRadius: '12px',
              padding: '48px 40px',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
              <h2 style={{
                fontWeight: 900,
                fontSize: '1.5rem',
                textTransform: 'uppercase',
                color: '#FFB020',
                marginBottom: '12px',
              }}>
                Scores Submitted
              </h2>
              <p style={{ color: '#888', lineHeight: 1.7 }}>
                Your scores have been recorded for all nine campaigns. Thank you for your time and expertise.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#F0F0EE',
                  marginBottom: '8px',
                }}>
                  Score All Nine Campaigns
                </h1>
                <p style={{ color: '#888', lineHeight: 1.7, maxWidth: '600px' }}>
                  Score each campaign against the four criteria (1–5 stars). Comments are optional but encouraged. Submit all scores at the bottom when you are done.
                </p>
              </div>

              {/* Criteria legend */}
              <div style={{
                background: '#1C1C1E',
                border: '1px solid #2A2A2E',
                borderRadius: '10px',
                padding: '20px 24px',
                marginBottom: '40px',
              }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FFB020',
                  marginBottom: '16px',
                }}>
                  Scoring Criteria Reference
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}>
                  {judging.criteria.map(c => (
                    <div key={c.id}>
                      <div style={{ fontWeight: 700, color: '#F0F0EE', fontSize: '0.85rem', marginBottom: '2px' }}>
                        {c.label}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {c.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project score cards — accordion */}
              {projects.map(project => (
                <ProjectScoreCard
                  key={project.id}
                  project={project}
                  scores={scores[project.id] || {}}
                  comments={comments[project.id] || ''}
                  onScoreChange={handleScoreChange}
                  onCommentChange={handleCommentChange}
                  disabled={false}
                  isOpen={!!openCards[project.id]}
                  onToggle={() => toggleCard(project.id)}
                />
              ))}

              {/* Submit all */}
              <div style={{
                background: '#1C1C1E',
                border: '1px solid #2A2A2E',
                borderRadius: '12px',
                padding: '32px',
                marginTop: '32px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  <div>
                    <div style={{
                      fontWeight: 900,
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      color: '#F0F0EE',
                      marginBottom: '4px',
                    }}>
                      Submit All Scores
                    </div>
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>
                      {completionPct < 100
                        ? `${totalCriteria - scoredCriteria} criteria still unscored — you can still submit.`
                        : 'All criteria scored — ready to submit!'}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 900,
                    fontSize: '2rem',
                    color: completionPct === 100 ? '#FFB020' : '#888',
                  }}>
                    {completionPct}%
                  </div>
                </div>

                {submitError && (
                  <div style={{
                    background: 'rgba(255,68,34,0.1)',
                    border: '1px solid rgba(255,68,34,0.3)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#FF4422',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                  }}>
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleSubmitAll}
                  disabled={submitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FFB020',
                    color: '#0D0D0F',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '16px 36px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {submitting && (
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(0,0,0,0.2)',
                      borderTopColor: '#0D0D0F',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  )}
                  {submitting ? 'Submitting...' : 'Submit All Scores'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </main>
  )
}
