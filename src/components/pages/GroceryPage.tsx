'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'

const CATEGORIES = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Pantry', 'Frozen', 'From Recipe', 'From Planner', 'Other']

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #DDD6C8',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  fontFamily: 'var(--font-jost)',
  color: '#1A1714',
  background: '#FAF7F2',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 500,
  color: '#9C9285',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: 6,
  fontFamily: 'var(--font-jost)',
}

export default function GroceryPage({ toast }: { toast: (m: string) => void }) {
  const { grocery, addGroceryItem, removeGroceryItem, toggleGroceryItem, clearCheckedGrocery } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState('Produce')
  const [shareEmail, setShareEmail] = useState('')

  const unchecked = grocery.filter((g) => !g.checked)
  const cats = Array.from(new Set(grocery.map((g) => g.category)))

  // Build plain-text list for sharing
  function buildListText() {
    const lines: string[] = ['Grocery List\n']
    cats.forEach(cat => {
      const items = grocery.filter(g => g.category === cat && !g.checked)
      if (items.length === 0) return
      lines.push(`${cat.toUpperCase()}`)
      items.forEach(i => lines.push(`  - ${i.name}${i.qty ? '  (' + i.qty + ')' : ''}`))
      lines.push('')
    })
    return lines.join('\n')
  }

  function handleSendEmail() {
    const body = encodeURIComponent(buildListText())
    const to = encodeURIComponent(shareEmail)
    window.open(`mailto:${to}?subject=Grocery%20List&body=${body}`)
  }

  function handleSendText() {
    const body = encodeURIComponent(buildListText())
    // sms: URI works on mobile; on desktop opens default SMS app if available
    window.open(`sms:?body=${body}`)
  }

  function handleAdd() {
    if (!name.trim()) { toast('Please enter an item name'); return }
    addGroceryItem({ id: Date.now(), name: name.trim(), qty: qty || '1', category, checked: false })
    setName(''); setQty(''); setCategory('Produce')
    setShowAdd(false)
    toast('Item added')
  }

  const btnBase: React.CSSProperties = {
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 11,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-jost)',
    cursor: 'pointer',
  }

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0, color: '#1A1714' }}>Grocery List</h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>
            {unchecked.length} item{unchecked.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowShare(true)}
            style={{ ...btnBase, background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549' }}
          >
            Share list
          </button>
          <button
            onClick={() => { clearCheckedGrocery(); toast('Cleared') }}
            style={{ ...btnBase, background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549' }}
          >
            Clear done
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{ ...btnBase, background: '#1A1714', border: 'none', color: '#F5F0E8' }}
          >
            Add item
          </button>
        </div>
      </div>

      {grocery.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9C9285' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, marginBottom: 8 }}>Nothing here yet</div>
          <div style={{ fontSize: 13 }}>Add items manually or generate from a recipe</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {cats.map((cat) => {
            const items = grocery.filter((g) => g.category === cat)
            return (
              <div key={cat}>
                <div style={{ fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 10, fontFamily: 'var(--font-jost)' }}>{cat}</div>
                <div style={{ background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 14 }}>
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 20px',
                        borderBottom: idx < items.length - 1 ? '1px solid #EDE6D8' : 'none',
                      }}
                    >
                      {/* Custom checkbox */}
                      <div
                        onClick={() => toggleGroceryItem(item.id)}
                        style={{
                          width: 17, height: 17, flexShrink: 0,
                          border: `1.5px solid ${item.checked ? '#6B8F71' : '#C8BEB0'}`,
                          borderRadius: 4,
                          background: item.checked ? '#6B8F71' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}
                      >
                        {item.checked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{
                        flex: 1, fontSize: 14, color: item.checked ? '#C8BEB0' : '#1A1714',
                        textDecoration: item.checked ? 'line-through' : 'none',
                        fontFamily: 'var(--font-jost)',
                        transition: 'all 0.15s',
                      }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 12, color: '#9C9285', fontFamily: 'var(--font-jost)' }}>{item.qty}</span>
                      <button
                        onClick={() => removeGroceryItem(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8BEB0', fontSize: 18, padding: '0 0 0 8px', lineHeight: 1 }}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add item modal */}
      {showAdd && (
        <Modal title="Add Item" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={labelStyle}>Item name</span>
              <input style={inputStyle} placeholder="e.g. Olive oil" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={labelStyle}>Quantity</span>
                <input style={inputStyle} placeholder="e.g. 1 bottle" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
              <div>
                <span style={labelStyle}>Category</span>
                <select style={{ ...inputStyle }} value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleAdd}
              style={{ width: '100%', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, padding: '13px', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer', marginTop: 4 }}
            >
              Add to list
            </button>
          </div>
        </Modal>
      )}

      {/* Share modal */}
      {showShare && (
        <Modal title="Share Grocery List" onClose={() => setShowShare(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Preview */}
            <div>
              <span style={labelStyle}>List preview</span>
              <div style={{ background: '#EDE6D8', borderRadius: 8, padding: '14px 16px', maxHeight: 200, overflowY: 'auto' }}>
                <pre style={{ fontSize: 12, color: '#5C5549', fontFamily: 'var(--font-jost)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {buildListText()}
                </pre>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #DDD6C8' }} />

            {/* Email */}
            <div>
              <span style={labelStyle}>Send via email</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  type="email"
                  placeholder="you@example.com"
                  value={shareEmail}
                  onChange={e => setShareEmail(e.target.value)}
                />
                <button
                  onClick={handleSendEmail}
                  style={{ ...btnBase, background: '#1A1714', color: '#F5F0E8', border: 'none', whiteSpace: 'nowrap' }}
                >
                  Open in Mail
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#C8BEB0', marginTop: 6 }}>Opens your default mail app with the list pre-filled</div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #DDD6C8' }} />

            {/* Text */}
            <div>
              <span style={labelStyle}>Send via text message</span>
              <button
                onClick={handleSendText}
                style={{ ...btnBase, background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549', width: '100%', justifyContent: 'center' }}
              >
                Open in Messages
              </button>
              <div style={{ fontSize: 11, color: '#C8BEB0', marginTop: 6 }}>Opens your SMS app with the list pre-filled — best on mobile</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
