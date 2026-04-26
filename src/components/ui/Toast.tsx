'use client'
import clsx from 'clsx'

export default function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={clsx(
        'fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C1A15] text-white px-5 py-2.5 rounded-full text-[13px] z-50 transition-all duration-300 pointer-events-none',
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      {message}
    </div>
  )
}
