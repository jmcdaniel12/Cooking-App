'use client'

export default function Toast({ message }: { message: string | null }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: `translateX(-50%) translateY(${message ? 0 : 8}px)`,
      background: '#1A1714',
      color: '#F5F0E8',
      padding: '10px 22px',
      borderRadius: 40,
      fontSize: 12,
      letterSpacing: '0.5px',
      zIndex: 200,
      transition: 'all 0.25s',
      opacity: message ? 1 : 0,
      pointerEvents: 'none',
      fontFamily: 'var(--font-jost)',
      boxShadow: '0 4px 20px rgba(26,23,20,0.2)',
    }}>
      {message}
    </div>
  )
}
