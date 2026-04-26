'use client'
import { useEffect } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}

export default function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,23,20,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, padding: 20,
      }}
    >
      <div style={{
        background: '#FAF7F2',
        borderRadius: 18,
        padding: '32px',
        maxWidth: wide ? 680 : 560,
        width: '100%',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(26,23,20,0.22)',
        border: '1px solid #DDD6C8',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 26, fontWeight: 400, color: '#1A1714', margin: 0, lineHeight: 1.1 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9285', fontSize: 20, padding: '0 0 0 16px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
