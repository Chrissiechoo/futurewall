import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import content from '../data/content'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Health + Wellness', value: 'health' },
  { label: 'Society + Community', value: 'society' },
  { label: 'Tech + AI', value: 'tech' },
  { label: 'Environment + Climate', value: 'environment' },
  { label: 'Community + Placemaking', value: 'community' },
]

const themeColors = {
  health: '#00D4E8',
  wellness: '#00D4E8',
  society: '#FF4422',
  tech: '#FFB020',
  environment: '#4CAF50',
  community: '#FF4422',
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const color = themeColors[project.theme] || '#00D4E8'

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Group badge */}
        <div style={{
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#00D4E8',
          marginBottom: '8px',
        }}>
          Group {String(project.groupNumber).padStart(2, '0')} · {project.client}
        </div>

        <h2 style={{
          fontWeight: 900,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          color: '#F0F0EE',
          marginBottom: '8px',
          lineHeight: 1.1,
        }}>
          {project.campaignName}
        </h2>

        {project.specialNote && (
          <div style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'rgba(255,176,32,0.15)',
            color: '#FFB020',
            padding: '5px 12px',
            borderRadius: '100px',
            marginBottom: '16px',
            border: '1px solid rgba(255,176,32,0.3)',
          }}>
            ★ {project.specialNote}
          </div>
        )}

        <p style={{
          color: '#888',
          fontStyle: 'italic',
          fontSize: '1rem',
          lineHeight: 1.6,
          marginBottom: '28px',
          borderLeft: `3px solid ${color}`,
          paddingLeft: '16px',
        }}>
          "{project.hook}"
        </p>

        {/* Theme pill */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '28px',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '100px',
            background: `${color}15`,
            color: color,
          }}>
            {project.themeLabel}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: '100px',
            background: '#1C1C1E',
            color: '#888',
          }}>
            {project.socialPlatform}
          </span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #2A2A2E', marginBottom: '28px' }} />

        {/* Details grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { label: 'The Big Idea', text: project.bigIdea },
            { label: 'Billboard Concept', text: project.billboardConcept },
            { label: 'Platform', text: project.platform },
            { label: 'QR Journey', text: project.qrJourney },
            { label: 'Target Audience', text: project.audience },
          ].map(item => (
            <div key={item.label}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: color,
                marginBottom: '6px',
              }}>
                {item.label}
              </div>
              <p style={{ color: '#F0F0EE', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {item.text}
              </p>
            </div>
          ))}

          {/* Team names */}
          {project.teamNames && (
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: color,
                marginBottom: '6px',
              }}>
                Team
              </div>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{project.teamNames}</p>
            </div>
          )}

          {/* Video embed */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: color,
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
              }}>
                <iframe
                  src={project.billboardVideoUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', display: 'block' }}
                  allowFullScreen
                  title={`${project.campaignName} billboard preview`}
                />
              </div>
            ) : (
              <div style={{
                background: '#1C1C1E',
                border: '1px dashed #2A2A2E',
                borderRadius: '8px',
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#888',
              }}>
                <div style={{ fontSize: '2rem' }}>▶</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Billboard video coming soon</div>
              </div>
            )}
          </div>

          {/* Platform link */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: color,
              marginBottom: '8px',
            }}>
              Campaign Platform
            </div>
            {project.platformUrl ? (
              <a
                href={project.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyan"
                style={{ display: 'inline-block' }}
              >
                Visit Platform →
              </a>
            ) : (
              <span style={{ color: '#888', fontSize: '0.9rem' }}>Link coming soon</span>
            )}
          </div>
        </div>

        {/* Vote CTA */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #2A2A2E',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <Link
            to={`/vote?group=${project.id}`}
            className="btn-red"
            onClick={onClose}
          >
            Audience Vote
          </Link>
          <button
            onClick={onClose}
            className="btn-outline-white"
          >
            Back to Projects
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  const color = themeColors[project.theme] || '#00D4E8'
  const groupLabel = `GROUP ${String(project.groupNumber).padStart(2, '0')}`

  return (
    <div
      style={{
        background: '#1C1C1E',
        border: '1px solid #2A2A2E',
        borderRadius: '12px',
        padding: '28px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      onClick={() => onOpen(project)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '60'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#2A2A2E'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Group label */}
      <div style={{
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#00D4E8',
      }}>
        {groupLabel}
      </div>

      {/* Client */}
      <div style={{ color: '#888', fontSize: '0.85rem' }}>{project.client}</div>

      {/* Campaign name */}
      <h3 style={{
        fontWeight: 900,
        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        color: '#F0F0EE',
        lineHeight: 1.2,
        flex: 1,
      }}>
        {project.campaignName}
      </h3>

      {/* Hook */}
      <p style={{
        color: '#888',
        fontStyle: 'italic',
        fontSize: '0.9rem',
        lineHeight: 1.6,
      }}>
        "{project.hook}"
      </p>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '100px',
          background: `${color}15`,
          color: color,
        }}>
          {project.themeLabel}
        </span>
        {project.specialNote && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '100px',
            background: 'rgba(255,176,32,0.15)',
            color: '#FFB020',
          }}>
            ★ {project.specialNote}
          </span>
        )}
      </div>

      {/* Vote button */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #2A2A2E' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#888',
          }}>
            See full campaign →
          </span>
          <Link
            to={`/vote?group=${project.id}`}
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FF4422',
              padding: '6px 12px',
              border: '1px solid rgba(255,68,34,0.3)',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,68,34,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Audience Vote →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects } = content
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState('all')
  const [openProject, setOpenProject] = useState(null)

  useEffect(() => {
    const groupParam = searchParams.get('group')
    if (groupParam) {
      const found = projects.find(p => p.id === groupParam)
      if (found) setOpenProject(found)
    }
  }, [searchParams, projects])

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'health') return p.theme === 'health' || p.theme === 'wellness'
    return p.theme === activeFilter
  })

  return (
    <main style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{
        background: '#0D0D0F',
        padding: '80px 0 60px',
        borderBottom: '1px solid #1C1C1E',
      }}>
        <div className="container">
          <div className="section-eyebrow">Trimester 2, AY 2025/26</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F0F0EE',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            Nine<br />
            <span style={{ color: '#00D4E8' }}>Campaigns.</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#888',
            lineHeight: 1.8,
            maxWidth: '580px',
          }}>
            Nine student groups. Nine real clients. Nine billboard campaigns — live on the Ten Square Super-Billboard on 30 April 2026.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section">
        <div className="container">
          {/* Filter buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '40px',
          }}>
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: `1px solid ${activeFilter === f.value ? '#00D4E8' : '#2A2A2E'}`,
                  background: activeFilter === f.value ? 'rgba(0,212,232,0.12)' : 'transparent',
                  color: activeFilter === f.value ? '#00D4E8' : '#888',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (activeFilter !== f.value) {
                    e.currentTarget.style.borderColor = '#888'
                    e.currentTarget.style.color = '#F0F0EE'
                  }
                }}
                onMouseLeave={e => {
                  if (activeFilter !== f.value) {
                    e.currentTarget.style.borderColor = '#2A2A2E'
                    e.currentTarget.style.color = '#888'
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <div style={{
            color: '#888',
            fontSize: '0.85rem',
            marginBottom: '24px',
          }}>
            Showing {filteredProjects.length} of {projects.length} campaigns
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
            className="projects-grid"
          >
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={setOpenProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {openProject && (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
