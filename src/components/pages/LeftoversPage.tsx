'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #DDD6C8', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-jost)',
  color: '#1A1714', background: '#FAF7F2', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 500, color: '#9C9285',
  textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontFamily: 'var(--font-jost)',
}

export default function LeftoversPage({ toast }: { toast: (m: string) => void }) {
  const { leftovers, addLeftover, removeLeftover, addRecipe, setPage } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [servings, setServings] = useState('2')
  const [note, setNote] = useState('')

  function handleAdd() {
    if (!name.trim()) { toast('Please enter a meal name'); return }
    addLeftover({ id: Date.now(), name: name.trim(), emoji: '—', date: 'Just now', servings: parseInt(servings) || 1, note })
    setName(''); setServings('2'); setNote('')
    setShowAdd(false)
    toast('Leftover added')
  }

  function handleAddToPlanner(id: number) {
    const l = leftovers.find(x => x.id === id)
    if (!l) return
    addRecipe({ id: Date.now(), name: `${l.name} (leftover)`, emoji: '—', cuisine: 'Leftover', time: 10, servings: l.servings, tags: ['leftover'], ingredients: [], steps: [], photo: null, notes: l.note })
    setPage('planner')
    toast('Added — now assign it to a day in the planner')
  }

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0 }}>Leftovers</h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>Track what's in the fridge, reduce waste</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}>
          Add leftover
        </button>
      </div>

      {leftovers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9C9285' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, marginBottom: 8 }}>Nothing here</div>
          <div style={{ fontSize: 13 }}>Log what's in your fridge to avoid waste</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leftovers.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 12, padding: '14px 20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, color: '#1A1714' }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#9C9285', marginTop: 2, fontFamily: 'var(--font-jost)' }}>{l.date}{l.note ? ` · ${l.note}` : ''}</div>
              </div>
              <span style={{ fontSize: 11, background: '#E8EFE9', color: '#3D5C42', padding: '3px 10px', borderRadius: 20 }}>
                {l.servings} serving{l.servings !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => handleAddToPlanner(l.id)}
                style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549', borderRadius: 8, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}
              >
                Add to planner
              </button>
              <button onClick={() => removeLeftover(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8BEB0', fontSize: 18 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Leftover" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={labelStyle}>Meal name</span>
              <input style={inputStyle} placeholder="e.g. Chicken Curry" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div>
              <span style={labelStyle}>Servings remaining</span>
              <input type="number" min="1" style={inputStyle} value={servings} onChange={e => setServings(e.target.value)} />
            </div>
            <div>
              <span style={labelStyle}>Storage note (optional)</span>
              <input style={inputStyle} placeholder="In airtight container, add splash of water when reheating" value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <button onClick={handleAdd} style={{ width: '100%', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, padding: '13px', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
