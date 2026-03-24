import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Vote', to: '/vote' },
  { label: 'RSVP', to: '/rsvp' },
  { label: 'How to Play', to: '/how-to-play' },
  { label: 'Partners', to: '/partners' },
  { label: 'Photos', to: '/photos' },
  { label: 'Judges', to: '/judges' },
]

export default function Nav() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'rgba(13, 13, 15, 0.95)',
      borderBottom: '1px solid #1C1C1E',
      zIndex: 900,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo / Brand */}
        <Link
          to="/"
          style={{
            fontWeight: 900,
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FF4422',
            lineHeight: 1.2,
            maxWidth: '180px',
          }}
        >
          Future Is On<br />The Wall
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }} className="nav-desktop">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  color: isActive ? '#FF4422' : '#888',
                  background: isActive ? 'rgba(255, 68, 34, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#F0F0EE'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#888'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          className="nav-hamburger"
        >
          <span style={{
            display: 'block',
            width: '22px',
            height: '2px',
            background: menuOpen ? '#FF4422' : '#F0F0EE',
            borderRadius: '2px',
            transition: 'all 0.2s ease',
            transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '22px',
            height: '2px',
            background: menuOpen ? '#FF4422' : '#F0F0EE',
            borderRadius: '2px',
            transition: 'all 0.2s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block',
            width: '22px',
            height: '2px',
            background: menuOpen ? '#FF4422' : '#F0F0EE',
            borderRadius: '2px',
            transition: 'all 0.2s ease',
            transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          background: '#0D0D0F',
          borderBottom: '1px solid #1C1C1E',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  color: isActive ? '#FF4422' : '#F0F0EE',
                  background: isActive ? 'rgba(255, 68, 34, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1C1C1E' }}>
            <Link
              to="/rsvp"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#FF4422',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              Register Now
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
