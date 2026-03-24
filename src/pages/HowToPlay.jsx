import { Link } from 'react-router-dom'
import content from '../data/content'

const stations = [
  {
    number: '01',
    title: 'Speak to a Team',
    description: 'Visit each project station and speak directly with the student team. Hear the brief, the insight, and the campaign idea in their own words.',
    icon: '💬',
    detail: 'Get your Future Passport stamped at each station.',
  },
  {
    number: '02',
    title: 'Cast Your Vote',
    description: 'Scan the QR code on your Future Passport — or visit /vote on this site — to vote for your favourite Audience Choice campaign.',
    icon: '🗳️',
    detail: 'One vote per guest. Votes close at 8:00PM.',
  },
  {
    number: '03',
    title: 'Future Wall',
    description: 'Upload a photo to the Future Wall — your image becomes part of the live installation projected alongside the campaigns. Tag #FutureIsOnTheWall.',
    icon: '📸',
    detail: 'Scan the QR near the Future Wall or visit /photos.',
  },
  {
    number: '04',
    title: 'Super-Billboard Selfie',
    description: 'Step outside and get your photo taken with the live Super-Billboard campaigns running on the Ten Square screen. This is the one for your grid.',
    icon: '🌆',
    detail: 'Best framing: stand 15–20m back from the building.',
  },
]

export default function HowToPlay() {
  const { awards } = content

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{
        background: '#0D0D0F',
        padding: '80px 0 60px',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div className="section-eyebrow">Your Guide to the Night</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '24px',
          }}>
            The Future<br />
            <span style={{ color: '#FFB020' }}>Passport</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#888',
            lineHeight: 1.8,
            maxWidth: '600px',
          }}>
            On arrival, you'll receive a physical Future Passport — an A4 booklet folded into 16 panels, one for each project team. Complete all four stations to unlock priority goodie bag queue access.
          </p>
        </div>
      </section>

      {/* Stations */}
      <section className="section">
        <div className="container">
          <div className="section-eyebrow">Four Stations</div>
          <h2 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            marginBottom: '48px',
          }}>
            Complete All Four
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}>
            {stations.map(station => (
              <div
                key={station.number}
                style={{
                  background: '#1C1C1E',
                  border: '1px solid #2A2A2E',
                  borderRadius: '12px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FFB020'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A2E'}
              >
                {/* Station number */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  fontWeight: 900,
                  fontSize: '3rem',
                  color: 'rgba(255,176,32,0.08)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}>
                  {station.number}
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255,176,32,0.1)',
                  border: '1px solid rgba(255,176,32,0.2)',
                  borderRadius: '8px',
                  fontSize: '1.5rem',
                  marginBottom: '16px',
                }}>
                  {station.icon}
                </div>

                <div style={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FFB020',
                  marginBottom: '8px',
                }}>
                  Station {station.number}
                </div>

                <h3 style={{
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.01em',
                  color: '#F0F0EE',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                }}>
                  {station.title}
                </h3>

                <p style={{
                  color: '#888',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}>
                  {station.description}
                </p>

                <div style={{
                  fontSize: '0.8rem',
                  color: '#FFB020',
                  fontWeight: 600,
                  borderTop: '1px solid #2A2A2E',
                  paddingTop: '12px',
                }}>
                  {station.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Incentive */}
          <div style={{
            background: 'rgba(255,176,32,0.08)',
            border: '1px solid rgba(255,176,32,0.25)',
            borderRadius: '10px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '1.8rem' }}>🎁</div>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFB020',
                marginBottom: '4px',
              }}>
                Complete All Stations
              </div>
              <div style={{ color: '#F0F0EE', fontWeight: 600 }}>
                Get stamped at all 4 stations → Priority goodie bag queue access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section style={{
        background: '#1C1C1E',
        borderTop: '1px solid #2A2A2E',
        padding: '80px 0',
      }}>
        <div className="container">
          <div className="section-eyebrow">The Awards</div>
          <h2 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            marginBottom: '48px',
          }}>
            Four Ways to Win
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {awards.map((award, idx) => {
              const colors = ['#FFB020', '#00D4E8', '#FF4422', '#F0F0EE']
              const color = colors[idx % colors.length]
              return (
                <div
                  key={award.id}
                  style={{
                    background: '#0D0D0F',
                    border: `1px solid ${color}30`,
                    borderRadius: '12px',
                    padding: '28px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '80'
                    e.currentTarget.style.background = `${color}08`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = color + '30'
                    e.currentTarget.style.background = '#0D0D0F'
                  }}
                >
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: color,
                    marginBottom: '12px',
                  }}>
                    Award 0{idx + 1}
                  </div>
                  <h3 style={{
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    color: '#F0F0EE',
                    marginBottom: '12px',
                  }}>
                    {award.name}
                  </h3>
                  <p style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}>
                    {award.description}
                  </p>
                  <div style={{
                    fontSize: '0.8rem',
                    color: color,
                    fontWeight: 600,
                    background: `${color}10`,
                    padding: '6px 12px',
                    borderRadius: '100px',
                    display: 'inline-block',
                  }}>
                    {award.judge}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Future Passport detail */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <div className="section-eyebrow">The Physical Artefact</div>
            <h2 style={{
              fontWeight: 900,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#F0F0EE',
              marginBottom: '24px',
            }}>
              Your Future Passport
            </h2>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
              The Future Passport is an A4 sheet folded vertically into 16 panels — a physical keepsake from the night. It includes a brief introduction to each of the nine campaigns, a stamp zone for each station, and the QR code to cast your Audience Choice vote.
            </p>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '32px' }}>
              Passports are printed and ready at the registration desk. Complete all four stations to unlock priority goodie bag queue access.
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <Link to="/projects" className="btn-cyan">
                See the 9 Projects
              </Link>
              <Link to="/vote" className="btn-outline">
                Cast Your Vote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
