import content from '../data/content'

function LogoBox({ name, role, url, image }) {
  const inner = (
    <div style={{
      background: '#1C1C1E',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      height: '100%',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = url ? 'rgba(0,212,232,0.45)' : 'rgba(255,255,255,0.25)'
        if (url) e.currentTarget.style.boxShadow = '0 0 24px rgba(0,212,232,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Logo area — shows image if provided, otherwise text placeholder */}
      <div style={{
        width: '100%',
        height: '80px',
        background: image ? 'transparent' : 'rgba(255,255,255,0.04)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: image ? '0' : '12px',
        overflow: 'hidden',
      }}>
        {image ? (
          <img
            src={image}
            alt={name}
            style={{
              maxWidth: '100%',
              maxHeight: '80px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              opacity: 0.85,
            }}
          />
        ) : (
          <span style={{
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: '0.04em',
          }}>
            {name}
          </span>
        )}
      </div>

      {/* Name shown below image (hidden if no image since name is already in the box) */}
      {image && (
        <div style={{
          fontWeight: 700,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          letterSpacing: '0.03em',
        }}>
          {name}
        </div>
      )}

      <div style={{
        textAlign: 'center',
        color: 'rgba(255,255,255,0.45)',
        fontSize: '0.78rem',
        lineHeight: 1.5,
        flex: 1,
      }}>
        {role}
      </div>

      {url && (
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: '#00D4E8',
          textTransform: 'uppercase',
        }}>
          Visit ↗
        </div>
      )}
    </div>
  )

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {inner}
      </a>
    )
  }
  return inner
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#00D4E8',
        marginBottom: '12px',
      }}>
        {eyebrow}
      </div>
      <h2 style={{
        fontWeight: 900,
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        color: '#F0F0EE',
        lineHeight: 1.1,
      }}>
        {title}
      </h2>
    </div>
  )
}

const sponsorTiers = [
  {
    label: 'Anchor Tier',
    borderColor: '#FFB020',
    items: [],
    placeholder: 'Anchor sponsor — enquire for details',
  },
  {
    label: 'Partner Tier',
    borderColor: '#00D4E8',
    items: ['Beer sponsor — TBC', 'Print sponsor — TBC'],
  },
  {
    label: 'Supporter Tier',
    borderColor: '#FF4422',
    items: ['Goodie bag — TBC', 'Umbrella — TBC'],
  },
]

export default function Partners() {
  const { partners } = content

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{
        background: '#0D0D0F',
        padding: '80px 0 60px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div className="container">
          <div className="section-eyebrow">Built With Support From</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            Partners &amp;<br />
            <span style={{ color: '#00D4E8' }}>Collaborators</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.8,
            maxWidth: '580px',
          }}>
            The Future Is On The Wall exists through the generosity and collaboration of institutional, industry, and community partners.
          </p>
        </div>
      </section>

      {/* Institutional Partners */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Academic + Venue" title="Institutional Partners" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {partners.institutional.map(p => (
              <LogoBox key={p.name} name={p.name} role={p.role} url={p.url} image={p.image} />
            ))}
          </div>
        </div>
      </section>

      {/* Industry Partners */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <SectionHeading eyebrow="Awards + Creative" title="Industry Partners" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {partners.industry.map(p => (
              <LogoBox key={p.name} name={p.name} role={p.role} url={p.url} image={p.image} />
            ))}
          </div>
        </div>
      </section>

      {/* Community Clients */}
      <section style={{
        background: '#1C1C1E',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '80px 0',
      }}>
        <div className="container">
          <SectionHeading eyebrow="Real Briefs, Real Organisations" title="Community Clients" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {partners.communityClients.map(p => (
              <LogoBox key={p.name} name={p.name} role={p.role} url={p.url} image={p.image} />
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Tiers */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Sponsors" title="Sponsor Tiers" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }}>
            {sponsorTiers.map(tier => (
              <div key={tier.label} style={{
                border: `1px solid ${tier.borderColor}40`,
                borderRadius: '10px',
                padding: '28px',
                background: `${tier.borderColor}06`,
              }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: tier.borderColor,
                  marginBottom: '16px',
                }}>
                  {tier.label}
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  {tier.items.length === 0 ? (
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px dashed rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '20px 24px',
                      color: 'rgba(255,255,255,0.25)',
                      fontSize: '0.9rem',
                    }}>
                      {tier.placeholder || 'Seeking sponsor — contact us'}
                    </div>
                  ) : (
                    tier.items.map((item, i) => (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        padding: '16px 24px',
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: '0.9rem',
                      }}>
                        {item}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* In-kind tracker */}
          <SectionHeading eyebrow="In-Kind" title="In-Kind Contributions" />

          <div style={{
            background: '#1C1C1E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 140px',
              padding: '14px 24px',
              background: '#0D0D0F',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
              }}>
                Item
              </div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'right',
              }}>
                Status
              </div>
            </div>

            {partners.inkind.map((item, idx) => {
              const isConfirmed = item.status === 'confirmed'
              return (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 140px',
                    padding: '16px 24px',
                    borderBottom: idx < partners.inkind.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ color: '#F0F0EE', fontSize: '0.9rem' }}>{item.item}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: isConfirmed ? 'rgba(76,175,80,0.15)' : 'rgba(255,176,32,0.15)',
                      color: isConfirmed ? '#4CAF50' : '#FFB020',
                    }}>
                      {isConfirmed ? 'Confirmed' : 'Seeking'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{
            background: 'rgba(0,212,232,0.06)',
            border: '1px solid rgba(0,212,232,0.2)',
            borderRadius: '10px',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#00D4E8',
                marginBottom: '4px',
              }}>
                Interested in Partnering?
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                If your organisation can support the event, we'd love to hear from you.
              </p>
            </div>
            <a
              href="mailto:partner@futureisonthelwall.sg"
              style={{
                display: 'inline-block',
                background: '#00D4E8',
                color: '#0D0D0F',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                borderRadius: '4px',
                border: '2px solid #00D4E8',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#00D4E8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#00D4E8'
                e.currentTarget.style.color = '#0D0D0F'
              }}
            >
              Get in Touch →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
