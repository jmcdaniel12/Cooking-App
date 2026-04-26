'use client'
import { useStore } from '@/store'
import clsx from 'clsx'

const NAV = [
  { id: 'inspire',   label: 'Inspire Me'    },
  { id: 'planner',  label: 'Week Planner'  },
  { id: 'recipes',  label: 'Recipes'       },
  { id: 'grocery',  label: 'Grocery List'  },
]

const NAV2 = [
  { id: 'pantry',    label: 'Pantry'     },
  { id: 'leftovers', label: 'Leftovers'  },
]

export default function Sidebar() {
  const { currentPage, setPage } = useStore()

  return (
    <aside
      style={{
        width: 210,
        minWidth: 210,
        background: '#1A1714',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#F5F0E8', fontStyle: 'italic', letterSpacing: 0.5, lineHeight: 1.1 }}>
          Mise en Place
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '3px', textTransform: 'uppercase', marginTop: 5 }}>
          Meal Planner
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        {NAV.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              fontSize: 12,
              fontFamily: 'var(--font-jost)',
              fontWeight: 400,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              textAlign: 'left',
              border: 'none',
              borderLeft: `2px solid ${currentPage === id ? '#6B8F71' : 'transparent'}`,
              background: currentPage === id ? 'rgba(107,143,113,0.1)' : 'transparent',
              color: currentPage === id ? '#F5F0E8' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}

        <div style={{ padding: '18px 24px 6px', fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
          Kitchen
        </div>

        {NAV2.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              fontSize: 12,
              fontFamily: 'var(--font-jost)',
              fontWeight: 400,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              textAlign: 'left',
              border: 'none',
              borderLeft: `2px solid ${currentPage === id ? '#6B8F71' : 'transparent'}`,
              background: currentPage === id ? 'rgba(107,143,113,0.1)' : 'transparent',
              color: currentPage === id ? '#F5F0E8' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom mark */}
      <div style={{ padding: '18px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        © 2025 Mise en Place
      </div>
    </aside>
  )
}
