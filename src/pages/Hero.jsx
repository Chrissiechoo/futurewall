import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import Countdown from '../components/Countdown'
import content from '../data/content'

export default function Hero() {
  const { event } = content
  const [rsvpCount, setRsvpCount] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'stats', 'rsvp'),
      snapshot => setRsvpCount(snapshot.exists() ? (snapshot.data().count ?? 0) : 0),
      err => console.error('RSVP count error:', err)
    )
    return () => unsub()
  }, [])

  const remaining = rsvpCount !== null ? Math.max(0, event.capacity - rsvpCount) : null

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0D0D0F',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '64px',
    }}>
      {/* Background grid texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,212,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,232,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(255,68,34,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px' }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#FFB020',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{
              display: 'inline-block',
              width: '32px',
              height: '2px',
              background: '#FFB020',
            }} />
            UN World Creativity and Innovation Month · 30 April 2026
          </div>

          {/* Main title */}
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#FF4422',
            lineHeight: 0.95,
            marginBottom: '32px',
          }}>
            The Future<br />Is On<br />The Wall
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
            color: '#F0F0EE',
            lineHeight: 1.5,
            marginBottom: '48px',
            maxWidth: '560px',
          }}>
            {event.tagline}
          </p>

          {/* Countdown */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#888',
              marginBottom: '16px',
            }}>
              Event Countdown
            </div>
            <Countdown />
          </div>

          {/* Meta pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '40px',
          }}>
            {[
              { label: '30 April 2026', color: '#F0F0EE' },
              { label: 'Ten Square, Singapore', color: '#F0F0EE' },
              { label: '6–9 PM SGT', color: '#F0F0EE' },
              { label: '#FutureIsOnTheWall', color: '#FFB020' },
            ].map(({ label, color }) => (
              <span
                key={label}
                style={{
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: '#1C1C1E',
                  border: '1px solid #2A2A2E',
                  color: color,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px',
            alignItems: 'center',
          }}>
            <Link to="/rsvp" className="btn-red" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
              Register Now
            </Link>
            <Link to="/projects" className="btn-outline" style={{ fontSize: '0.9rem', padding: '16px 36px' }}>
              See the 9 Projects
            </Link>
          </div>

          {/* Live RSVP counter */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00D4E8',
              boxShadow: '0 0 10px #00D4E8',
              flexShrink: 0,
              animation: 'livePulse 2s infinite',
            }} />
            {rsvpCount === null ? (
              <span style={{ color: '#888', fontSize: '0.9rem' }}>Loading registrations...</span>
            ) : (
              <span style={{ color: '#F0F0EE', fontWeight: 400, fontSize: '0.95rem' }}>
                <span style={{ color: '#00D4E8', fontWeight: 900, fontSize: '1.2rem' }}>{rsvpCount}</span>
                {' '}guests registered
                {remaining !== null && remaining > 0 && (
                  <span style={{ color: '#888' }}>
                    {' '}· <span style={{ color: '#F0F0EE', fontWeight: 600 }}>{remaining}</span> spots remaining
                  </span>
                )}
                {remaining === 0 && (
                  <span style={{ color: '#FF4422', fontWeight: 600 }}> · Capacity reached</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #FF4422 0%, #FFB020 33%, #00D4E8 66%, #FF4422 100%)',
      }} />

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </main>
  )
}
