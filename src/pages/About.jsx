import content from '../data/content'

const stats = [
  { value: '9', label: 'Groups', sub: 'Student creative teams' },
  { value: '50+', label: 'Students', sub: 'DCM3001 module cohort' },
  { value: '7', label: 'Clients', sub: 'Real community organisations' },
  { value: 'April', label: 'UN World Creativity Day', sub: '21 April 2026' },
]

export default function About() {
  const { event, history } = content

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Hero section */}
      <section style={{
        background: '#0D0D0F',
        padding: '80px 0 60px',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div className="section-eyebrow">About the Event</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '32px',
          }}>
            One Night.<br />
            <span style={{ color: '#FF4422' }}>Nine Futures.</span>
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: '#888',
            lineHeight: 1.8,
            maxWidth: '700px',
          }}>
            On 30 April 2026, fifty-plus students from Singapore Institute of Technology will unveil nine billboard campaigns live on the Ten Square Super-Billboard — one of Singapore's most prominent out-of-home media sites.
          </p>
        </div>
      </section>

      {/* Event Story */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
          }}>
            <div>
              <div className="section-eyebrow">What is This?</div>
              <h2 style={{
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: '#F0F0EE',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}>
                A Real Brief.<br />A Real Venue.<br />A Real Audience.
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
                <em>{event.module}</em> is a final-year module at {event.institution} that asks students to move beyond theory and produce work that functions in the real world.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
                This year, nine student groups were each assigned a real community client — from an AI journalling startup, to a dementia awareness NGO, to an AI leadership summit. Their brief: design a complete billboard campaign that works on the Ten Square Super-Billboard, bridges to a digital platform via QR, and moves an audience to act.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8 }}>
                On 30 April, those campaigns go live — on the screen, in front of industry judges, community clients, alumni, and the public.
              </p>
            </div>

            <div>
              <div className="section-eyebrow">Why It Matters</div>
              <h2 style={{
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: '#F0F0EE',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}>
                UN World Creativity &amp; Innovation Month
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
                The event is anchored to <strong style={{ color: '#00D4E8' }}>30 April 2026 — UN World Creativity and Innovation Month</strong>, with UN Day falling on 21 April. The timing is deliberate: creativity is not decoration, it is a civic force.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
                Each of the nine campaigns addresses a different dimension of how Singapore — and the world — might look in the future: from bio-age fitness, to AI leadership maturity, to dementia awareness, to placemaking.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8 }}>
                The awards — Spike Asia Choice, Audience Choice, Gary's Choice, and Client's Choice — are judged by real practitioners from industry, venue, and the community organisations themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        background: '#1C1C1E',
        borderTop: '1px solid #2A2A2E',
        borderBottom: '1px solid #2A2A2E',
        padding: '60px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
          }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontWeight: 900,
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  letterSpacing: '-0.03em',
                  color: '#FF4422',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F0F0EE',
                  marginBottom: '4px',
                }}>
                  {stat.label}
                </div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-eyebrow">Ten Square × SIT History</div>
          <h2 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            marginBottom: '48px',
          }}>
            A Decade of Creative Community
          </h2>

          <div style={{ maxWidth: '700px' }}>
            {history.map((item, idx) => (
              <div
                key={item.year}
                style={{
                  display: 'flex',
                  gap: '32px',
                  paddingBottom: idx < history.length - 1 ? '48px' : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {idx < history.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '56px',
                    top: '44px',
                    bottom: 0,
                    width: '2px',
                    background: 'linear-gradient(#2A2A2E, #2A2A2E)',
                  }} />
                )}

                {/* Year */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '80px',
                    height: '44px',
                    background: idx === history.length - 1 ? 'rgba(255,68,34,0.15)' : '#1C1C1E',
                    border: `1px solid ${idx === history.length - 1 ? '#FF4422' : '#2A2A2E'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    letterSpacing: '0.06em',
                    color: idx === history.length - 1 ? '#FF4422' : '#888',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {item.year}
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingTop: '8px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#F0F0EE',
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.event}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {item.note}
                  </div>
                  {item.goh && (
                    <div style={{
                      marginTop: '8px',
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#FFB020',
                      background: 'rgba(255,176,32,0.1)',
                      padding: '4px 10px',
                      borderRadius: '100px',
                    }}>
                      {item.goh}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module details */}
      <section style={{
        background: '#1C1C1E',
        borderTop: '1px solid #2A2A2E',
        padding: '60px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              { label: 'Module', value: event.module },
              { label: 'Trimester', value: event.trimester },
              { label: 'Institution', value: event.institution },
              { label: 'Venue', value: `${event.venue} — ${event.venueAddress}` },
            ].map(item => (
              <div key={item.label} style={{
                background: '#0D0D0F',
                border: '1px solid #2A2A2E',
                borderRadius: '8px',
                padding: '24px',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#00D4E8',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </div>
                <div style={{ color: '#F0F0EE', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
