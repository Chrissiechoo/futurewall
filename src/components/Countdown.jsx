import { useState, useEffect } from 'react'

const EVENT_TIME = new Date('2026-04-30T17:00:00+08:00').getTime()

function getTimeLeft() {
  const now = Date.now()
  const diff = EVENT_TIME - now

  if (diff <= 0) {
    return null
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

function TimeBlock({ value, label }) {
  const display = String(value).padStart(2, '0')
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{
        background: '#1C1C1E',
        border: '1px solid #2A2A2E',
        borderRadius: '8px',
        padding: '20px 24px',
        minWidth: '80px',
        textAlign: 'center',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontVariantNumeric: 'tabular-nums',
        color: '#00D4E8',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <span style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,212,232,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        {display}
      </div>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#888',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!timeLeft) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(0, 212, 232, 0.1)',
        border: '1px solid rgba(0, 212, 232, 0.3)',
        borderRadius: '8px',
        padding: '16px 28px',
      }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#00D4E8',
          boxShadow: '0 0 12px #00D4E8',
          flexShrink: 0,
          animation: 'pulse 1.5s infinite',
        }} />
        <span style={{
          fontWeight: 900,
          fontSize: '1.1rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#00D4E8',
        }}>
          The future is live.
        </span>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(8px, 2vw, 20px)',
        flexWrap: 'nowrap',
      }}>
        <TimeBlock value={timeLeft.days} label="Days" />
        <div style={{ color: '#2A2A2E', fontSize: '2rem', fontWeight: 900, paddingBottom: '28px' }}>:</div>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <div style={{ color: '#2A2A2E', fontSize: '2rem', fontWeight: 900, paddingBottom: '28px' }}>:</div>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <div style={{ color: '#2A2A2E', fontSize: '2rem', fontWeight: 900, paddingBottom: '28px' }}>:</div>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  )
}
