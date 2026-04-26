'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-[#1C1A15]/50 flex items-center justify-center z-50 p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#FFFEF9] rounded-[18px] p-7 max-w-[560px] w-full max-h-[85vh] overflow-y-auto shadow-[0_8px_32px_rgba(28,26,21,0.18)]">
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-display text-[22px] font-normal">{title}</h2>
          <button onClick={onClose} className="text-[#A89E93] hover:text-[#1C1A15] transition-colors mt-0.5">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
