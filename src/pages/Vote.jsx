import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'
import content from '../data/content'

const SESSION_ID = Math.random().toString(36).slice(2)
const VOTED_KEY = 'futurewall_voted'
const LOCKED_MESSAGE = 'Vote tallies are hidden until event night. Scan the QR at Ten Square on 30 April to see the live leaderboard.'

export default function Vote() {
  const { projects } = content
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('vote')

  // Vote form state
  const [selectedGroup, setSelectedGroup] = useState('')
  const [reason, setReason] = useState('')
  const [voterName, setVoterName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [alreadyVotedFor, setAlreadyVotedFor] = useState('')

  // Leaderboard state
  const [leaderboardVisible, setLeaderboardVisible] = useState(false)
  const [votes, setVotes] = useState([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  useEffect(() => {
    // Support both navigation state (preSelected) and query param (?group=)
    const preSelected = location.state?.preSelected
    const groupParam = searchParams.get('group')
    const initial = preSelected || groupParam
    if (initial) {
      setSelectedGroup(initial)
    }
  }, [searchParams, location.state])

  useEffect(() => {
    const voted = localStorage.getItem(VOTED_KEY)
    if (voted) {
      setAlreadyVoted(true)
      const p = projects.find(p => p.id === voted)
      setAlreadyVotedFor(p ? p.campaignName : voted)
    }
  }, [projects])

  // Listen to leaderboard visibility flag
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'leaderboardVisible'),
      snap => {
        if (snap.exists()) {
          setLeaderboardVisible(!!snap.data().visible)
        } else {
          setLeaderboardVisible(false)
        }
        setLoadingLeaderboard(false)
      },
      err => {
        console.error('Leaderboard settings error:', err)
        setLoadingLeaderboard(false)
      }
    )
    return () => unsub()
  }, [])

  // Listen to votes collection for leaderboard
  useEffect(() => {
    if (!leaderboardVisible) return
    const unsub = onSnapshot(
      collection(db, 'votes'),
      snapshot => {
        const all = []
        snapshot.forEach(d => all.push(d.data()))
        setVotes(all)
      },
      err => console.error('Votes error:', err)
    )
    return () => unsub()
  }, [leaderboardVisible])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedGroup) return
    if (alreadyVoted) return

    setSubmitting(true)
    setError('')

    try {
      const project = projects.find(p => p.id === selectedGroup)
      await addDoc(collection(db, 'votes'), {
        groupId: selectedGroup,
        groupLabel: project ? project.campaignName : selectedGroup,
        reason: reason.trim(),
        voterName: voterName.trim(),
        timestamp: serverTimestamp(),
        sessionId: SESSION_ID,
      })

      localStorage.setItem(VOTED_KEY, selectedGroup)
      setAlreadyVoted(true)
      setAlreadyVotedFor(project ? project.campaignName : selectedGroup)
      setSubmitted(true)
    } catch (err) {
      console.error('Vote submit error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Tally votes for leaderboard
  const tallied = projects.map(p => {
    const count = votes.filter(v => v.groupId === p.id).length
    return { project: p, count }
  }).sort((a, b) => b.count - a.count)

  const maxVotes = tallied.length > 0 ? Math.max(...tallied.map(t => t.count), 1) : 1

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Header */}
      <section style={{
        background: '#0D0D0F',
        padding: '60px 0 0',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div className="section-eyebrow">Audience Choice Award</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '24px',
          }}>
            Your Vote.<br />
            <span style={{ color: '#FF4422' }}>Their Future.</span>
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginTop: '32px' }}>
            {[
              { id: 'vote', label: 'Cast Your Vote' },
              { id: 'leaderboard', label: 'Leaderboard' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? '#FF4422' : '#888',
                  borderBottom: `2px solid ${activeTab === tab.id ? '#FF4422' : 'transparent'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">

          {/* ---- VOTE TAB ---- */}
          {activeTab === 'vote' && (
            <div style={{ maxWidth: '640px' }}>
              {alreadyVoted && !submitted ? (
                /* Already voted message */
                <div style={{
                  background: 'rgba(0,212,232,0.08)',
                  border: '1px solid rgba(0,212,232,0.25)',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
                  <h2 style={{
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    color: '#00D4E8',
                    marginBottom: '12px',
                  }}>
                    You've Already Voted
                  </h2>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '8px' }}>
                    You voted for: <strong style={{ color: '#F0F0EE' }}>{alreadyVotedFor}</strong>
                  </p>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '28px' }}>
                    Thank you for your vote. Check the leaderboard to see how it's going on event night.
                  </p>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className="btn-cyan"
                  >
                    See Leaderboard
                  </button>
                </div>
              ) : submitted ? (
                /* Success state */
                <div style={{
                  background: 'rgba(255,68,34,0.08)',
                  border: '1px solid rgba(255,68,34,0.25)',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
                  <h2 style={{
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    color: '#FF4422',
                    marginBottom: '12px',
                  }}>
                    Vote Submitted!
                  </h2>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '8px' }}>
                    You voted for: <strong style={{ color: '#F0F0EE' }}>{alreadyVotedFor}</strong>
                  </p>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '28px' }}>
                    The Audience Choice winner will be announced on event night, 30 April 2026.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className="btn-cyan"
                    >
                      See Leaderboard
                    </button>
                    <Link to="/projects" className="btn-outline">
                      Browse Projects
                    </Link>
                  </div>
                </div>
              ) : (
                /* Vote form */
                <form onSubmit={handleSubmit}>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: '32px' }}>
                    One vote per guest. Choose the campaign that impressed you most — or use this to support a team before you arrive on the night.
                  </p>

                  {/* Project selector */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#888' }}>
                      Your favourite campaign *
                    </label>
                    <select
                      required
                      value={selectedGroup}
                      onChange={e => setSelectedGroup(e.target.value)}
                      className="form-input"
                      style={{ background: '#1C1C1E', color: '#F0F0EE' }}
                    >
                      <option value="">Select a campaign...</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          Group {String(p.groupNumber).padStart(2, '0')} · {p.client} — {p.campaignName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Why textarea */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#888' }}>
                      Why did this stand out? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="What made this campaign memorable?"
                      rows={4}
                      className="form-input"
                      style={{
                        background: '#1C1C1E',
                        color: '#F0F0EE',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Name input */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#888' }}>
                      Your name <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={voterName}
                      onChange={e => setVoterName(e.target.value)}
                      placeholder="First name or handle"
                      className="form-input"
                      style={{ background: '#1C1C1E', color: '#F0F0EE' }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(255,68,34,0.1)',
                      border: '1px solid rgba(255,68,34,0.3)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#FF4422',
                      fontSize: '0.9rem',
                      marginBottom: '16px',
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !selectedGroup}
                    className="btn-red"
                    style={{
                      opacity: submitting || !selectedGroup ? 0.5 : 1,
                      cursor: submitting || !selectedGroup ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {submitting && <span className="spinner" style={{ width: '16px', height: '16px' }} />}
                    {submitting ? 'Submitting...' : 'Submit Vote'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ---- LEADERBOARD TAB ---- */}
          {activeTab === 'leaderboard' && (
            <div style={{ maxWidth: '720px' }}>
              {loadingLeaderboard ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '40px 0' }}>
                  <div className="spinner" />
                  <span style={{ color: '#888' }}>Loading leaderboard...</span>
                </div>
              ) : !leaderboardVisible ? (
                /* Locked state */
                <div style={{
                  background: 'rgba(255,176,32,0.06)',
                  border: '1px solid rgba(255,176,32,0.25)',
                  borderRadius: '12px',
                  padding: '48px 40px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 0 12px rgba(255,176,32,0.4))',
                  }}>🔒</div>
                  <h2 style={{
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    textTransform: 'uppercase',
                    color: '#FFB020',
                    marginBottom: '16px',
                  }}>
                    Leaderboard Locked
                  </h2>
                  <p style={{
                    color: '#888',
                    lineHeight: 1.8,
                    maxWidth: '420px',
                    margin: '0 auto 28px',
                  }}>
                    {LOCKED_MESSAGE}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {content.event.hashtags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#FFB020',
                          background: 'rgba(255,176,32,0.1)',
                          padding: '4px 10px',
                          borderRadius: '100px',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Live leaderboard */
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '32px',
                  }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#FF4422',
                      boxShadow: '0 0 10px #FF4422',
                      animation: 'livePulse 2s infinite',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#FF4422',
                    }}>
                      Live Results — {votes.length} vote{votes.length !== 1 ? 's' : ''} cast
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tallied.map(({ project: p, count }, idx) => {
                      const pct = (count / maxVotes) * 100
                      return (
                        <div key={p.id} style={{
                          background: '#1C1C1E',
                          border: '1px solid #2A2A2E',
                          borderRadius: '8px',
                          padding: '16px 20px',
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                            gap: '12px',
                          }}>
                            <div>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                color: '#00D4E8',
                                marginRight: '8px',
                              }}>
                                GRP{String(p.groupNumber).padStart(2, '0')}
                              </span>
                              <span style={{
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: '#F0F0EE',
                              }}>
                                {p.campaignName}
                              </span>
                            </div>
                            <div style={{
                              fontWeight: 900,
                              fontSize: '1.2rem',
                              color: idx === 0 ? '#FFB020' : '#F0F0EE',
                              flexShrink: 0,
                            }}>
                              {count}
                              {idx === 0 && count > 0 && (
                                <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>★</span>
                              )}
                            </div>
                          </div>

                          {/* Bar */}
                          <div style={{
                            height: '6px',
                            background: '#2A2A2E',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: idx === 0
                                ? 'linear-gradient(90deg, #FFB020, #FF4422)'
                                : '#00D4E8',
                              borderRadius: '3px',
                              transition: 'width 0.6s ease',
                            }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </main>
  )
}
