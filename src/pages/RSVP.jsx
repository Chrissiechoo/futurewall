import { useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import content from '../data/content'

const affiliationCategories = {
  student: ['SIT current student'],
  alumni: ['SIT alumni — GSA', 'SIT alumni — DCIM', 'SIT alumni — other programme'],
  industry: ['Industry professional / agency', 'Community client / partner organisation', 'SIT staff / faculty'],
  public: ['Member of the public'],
}

const affiliationColors = {
  student: '#00D4E8',
  alumni: '#FFB020',
  industry: '#FF4422',
  public: '#4CAF50',
}

const affiliationLabels = {
  student: 'Students',
  alumni: 'Alumni',
  industry: 'Industry',
  public: 'Public',
}

export default function RSVP() {
  const { rsvp, event } = content
  const [rsvpData, setRsvpData] = useState([])
  const [loadingCount, setLoadingCount] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affiliation: '',
    organisation: '',
    projectCuriosity: '',
    referral: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'rsvp'),
      snap => {
        const docs = []
        snap.forEach(d => docs.push(d.data()))
        setRsvpData(docs)
        setLoadingCount(false)
      },
      err => {
        console.error('RSVP snapshot error:', err)
        setLoadingCount(false)
      }
    )
    return () => unsub()
  }, [])

  const total = rsvpData.length
  const remaining = Math.max(0, event.capacity - total)

  const breakdown = {}
  Object.keys(affiliationCategories).forEach(cat => {
    const terms = affiliationCategories[cat]
    breakdown[cat] = rsvpData.filter(r => terms.includes(r.affiliation)).length
  })

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.affiliation) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      await addDoc(collection(db, 'rsvp'), {
        ...formData,
        timestamp: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('RSVP submit error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#fff',
    border: '1.5px solid #ddd',
    borderRadius: '4px',
    color: '#111',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'border-color 0.2s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    color: '#444',
  }

  return (
    <main style={{ paddingTop: '64px', background: '#F5F5F0', minHeight: '100vh' }}>
      {/* Header — dark */}
      <section style={{
        background: '#0D0D0F',
        padding: '60px 0 48px',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#00D4E8',
            marginBottom: '16px',
          }}>
            30 April 2026 · Ten Square, Singapore
          </div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '24px',
          }}>
            Register<br />
            <span style={{ color: '#FF4422' }}>Your Place</span>
          </h1>

          {/* Live counter */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
          }}>
            {loadingCount ? (
              <div style={{
                height: '20px',
                width: '200px',
                background: '#1C1C1E',
                borderRadius: '4px',
              }} className="skeleton" />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FF4422',
                  boxShadow: '0 0 8px #FF4422',
                  animation: 'livePulse 2s infinite',
                  flexShrink: 0,
                }} />
                <span style={{ color: '#F0F0EE', fontWeight: 400, fontSize: '1rem' }}>
                  <span style={{ color: '#00D4E8', fontWeight: 900, fontSize: '2rem' }}>{total}</span>
                  {' '}registered
                  {remaining > 0
                    ? <span style={{ color: '#888', fontWeight: 400 }}> · {remaining} of {event.capacity} spots remaining</span>
                    : <span style={{ color: '#FF4422', fontWeight: 600 }}> · Event is at capacity</span>
                  }
                </span>
              </div>
            )}
          </div>

          {/* Affiliation breakdown */}
          {!loadingCount && total > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px',
            }}>
              {Object.keys(affiliationCategories).map(cat => {
                const count = breakdown[cat]
                if (count === 0) return null
                return (
                  <span
                    key={cat}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: `${affiliationColors[cat]}15`,
                      color: affiliationColors[cat],
                    }}
                  >
                    {affiliationLabels[cat]}: {count}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Form section */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            {submitted ? (
              /* Success */
              <div style={{
                background: '#fff',
                border: '2px solid #FF4422',
                borderRadius: '12px',
                padding: '48px 40px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
                <h2 style={{
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  textTransform: 'uppercase',
                  color: '#FF4422',
                  marginBottom: '12px',
                }}>
                  You're Registered!
                </h2>
                <p style={{
                  color: '#555',
                  lineHeight: 1.8,
                  marginBottom: '8px',
                  fontSize: '1rem',
                }}>
                  <strong>{formData.name}</strong>, your registration has been received.
                </p>
                <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '8px' }}>
                  See you on <strong>30 April 2026, {event.displayTime}</strong> at <strong>Ten Square</strong>!
                </p>
                <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.95rem' }}>
                  Free and easy — come as you are, come as you please. Just come and celebrate with us. 🎉
                </p>
                <div style={{
                  background: '#F5F5F0',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>Venue</div>
                  <div style={{ color: '#111', fontWeight: 600 }}>{event.venue} — {event.venueAddress}</div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                  {content.event.hashtags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#FF4422',
                        background: 'rgba(255,68,34,0.08)',
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
              /* Form */
              <div>
                <h2 style={{
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#111',
                  marginBottom: '8px',
                }}>
                  RSVP — Free Admission
                </h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '32px' }}>
                  This event is free and open to all. Register to help us plan and to receive event reminders.
                  Capacity: {event.capacity} guests.
                </p>

                {remaining === 0 && (
                  <div style={{
                    background: 'rgba(255,68,34,0.08)',
                    border: '1px solid rgba(255,68,34,0.3)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    marginBottom: '24px',
                    color: '#FF4422',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}>
                    This event has reached its registered capacity. Walk-in guests are welcome subject to space on the night.
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Full name */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-name">
                      Full name <span style={{ color: '#FF4422' }}>*</span>
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-email">
                      Email address <span style={{ color: '#FF4422' }}>*</span>
                    </label>
                    <input
                      id="rsvp-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    />
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-affiliation">
                      I am a... <span style={{ color: '#FF4422' }}>*</span>
                    </label>
                    <select
                      id="rsvp-affiliation"
                      required
                      value={formData.affiliation}
                      onChange={e => handleChange('affiliation', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    >
                      <option value="">Select...</option>
                      {rsvp.affiliationOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Organisation */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-org">
                      Organisation or company
                    </label>
                    <input
                      id="rsvp-org"
                      type="text"
                      value={formData.organisation}
                      onChange={e => handleChange('organisation', e.target.value)}
                      placeholder="e.g. Ogilvy, NUS, Freelance..."
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    />
                  </div>

                  {/* Project curiosity */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-project">
                      Which project are you most curious about?
                    </label>
                    <select
                      id="rsvp-project"
                      value={formData.projectCuriosity}
                      onChange={e => handleChange('projectCuriosity', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    >
                      <option value="">Select...</option>
                      {rsvp.projectOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Referral */}
                  <div>
                    <label style={labelStyle} htmlFor="rsvp-referral">
                      How did you hear about this?
                    </label>
                    <select
                      id="rsvp-referral"
                      value={formData.referral}
                      onChange={e => handleChange('referral', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = '#FF4422'}
                      onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
                    >
                      <option value="">Select...</option>
                      {rsvp.referralOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(255,68,34,0.08)',
                      border: '1px solid rgba(255,68,34,0.3)',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      color: '#FF4422',
                      fontSize: '0.9rem',
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#FF4422',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '16px 36px',
                      borderRadius: '4px',
                      border: '2px solid #FF4422',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {submitting && (
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                    )}
                    {submitting ? 'Registering...' : 'Register Now — Free'}
                  </button>

                  <p style={{ color: '#999', fontSize: '0.8rem', lineHeight: 1.6 }}>
                    Your details will only be used for event coordination. No spam. No selling your data.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}
