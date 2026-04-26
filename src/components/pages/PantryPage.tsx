'use client'
import { useState } from 'react'
import { useStore, PantryStatus } from '@/store'
import Modal from '../ui/Modal'

const STATUS = {
  good: { label: 'Fresh',     bg: '#E8EFE9', color: '#3D5C42' },
  warn: { label: 'Use soon',  bg: '#FBF5E6', color: '#7A6020' },
  bad:  { label: 'Expiring',  bg: '#F5EAE3', color: '#8B3A1E' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #DDD6C8', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-jost)',
  color: '#1A1714', background: '#FAF7F2', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 500, color: '#9C9285',
  textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 6, fontFamily: 'var(--font-jost)',
}

export default function PantryPage({ toast }: { toast: (m: string) => void }) {
  const { pantry, addPantryItem, removePantryItem } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [status, setStatus] = useState<PantryStatus>('good')

  const expiring = pantry.filter(p => p.status === 'bad')

  function handleAdd() {
    if (!name.trim()) { toast('Please enter an item name'); return }
    addPantryItem({ id: Date.now(), name: name.trim(), qty: qty || '1', status })
    setName(''); setQty(''); setStatus('good')
    setShowAdd(false)
    toast('Item added')
  }

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0 }}>Pantry</h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>Track what you have, reduce waste</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}>
          Add item
        </button>
      </div>

      {expiring.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F5EAE3', border: '1px solid rgba(181,98,58,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#8B3A1E', fontFamily: 'var(--font-jost)' }}>Use these soon: </span>
            <span style={{ fontSize: 13, color: '#8B3A1E', fontFamily: 'var(--font-jost)' }}>{expiring.map(p => p.name).join(', ')}</span>
          </div>
        </div>
      )}

      {pantry.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9C9285' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, marginBottom: 8 }}>Pantry is empty</div>
          <div style={{ fontSize: 13 }}>Add items to track freshness and reduce waste</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pantry.map(item => {
            const s = STATUS[item.status]
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 10, padding: '12px 18px' }}>
                <span style={{ flex: 1, fontSize: 14, fontFamily: 'var(--font-jost)', color: '#1A1714' }}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#9C9285', fontFamily: 'var(--font-jost)', marginRight: 8 }}>{item.qty}</span>
                <span style={{ fontSize: 10, background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</span>
                <button onClick={() => removePantryItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8BEB0', fontSize: 18, padding: '0 0 0 8px' }}>×</button>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Add to Pantry" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={labelStyle}>Item name</span>
              <input style={inputStyle} placeholder="e.g. Canned tomatoes" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>Quantity</span>
                <input style={inputStyle} placeholder="e.g. 3 cans" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
              <div>
                <span style={labelStyle}>Status</span>
                <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as PantryStatus)}>
                  <option value="good">Fresh / Good</option>
                  <option value="warn">Use soon</option>
                  <option value="bad">Expiring</option>
                </select>
              </div>
            </div>
            <button onClick={handleAdd} style={{ width: '100%', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, padding: '13px', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}>
              Add Item
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
