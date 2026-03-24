import { Link } from 'react-router-dom'
import content from '../data/content'

export default function Footer() {
  const { event } = content

  return (
    <footer style={{
      background: '#0D0D0F',
      borderTop: '1px solid #1C1C1E',
      padding: '60px 0 32px',
    }}>
      <div className="container">
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FF4422',
              marginBottom: '12px',
            }}>
              The Future Is On The Wall
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {event.tagline}
            </p>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '8px' }}>
              {event.module}
            </p>
          </div>

          {/* Event details */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00D4E8',
              marginBottom: '12px',
            }}>Event Details</div>
            <div style={{ color: '#888', fontSize: '0.9rem', lineHeight: 2 }}>
              <div style={{ color: '#F0F0EE', fontWeight: 600 }}>30 April 2026</div>
              <div>{event.displayTime} SGT</div>
              <div style={{ color: '#F0F0EE', fontWeight: 600, marginTop: '8px' }}>{event.venue}</div>
              <div>{event.venueAddress}</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00D4E8',
              marginBottom: '12px',
            }}>Navigate</div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {[
                { label: 'About', to: '/about' },
                { label: 'The 9 Projects', to: '/projects' },
                { label: 'Cast Your Vote', to: '/vote' },
                { label: 'Register (RSVP)', to: '/rsvp' },
                { label: 'Photo Wall', to: '/photos' },
                { label: 'Partners', to: '/partners' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F0F0EE'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00D4E8',
              marginBottom: '12px',
            }}>Follow Along</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {event.hashtags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#FFB020',
                    background: 'rgba(255, 176, 32, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '16px', lineHeight: 1.6 }}>
              {event.unDay}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1C1C1E',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{ color: '#888', fontSize: '0.8rem' }}>
            © 2026 SIT × Ten Square. DCM3001.
          </p>
          <p style={{ color: '#888', fontSize: '0.8rem' }}>
            {event.module}
          </p>
        </div>
      </div>
    </footer>
  )
}
