'use client'
import { useState } from 'react'
import { useStore, PantryStatus } from '@/store'
import Modal from '../ui/Modal'
import { X } from 'lucide-react'

const STATUS_MAP: Record<PantryStatus, { label: string; cls: string }> = {
  good: { label: 'Fresh', cls: 'bg-[#EDF3EE] text-[#4A6B4E]' },
  warn: { label: 'Use soon', cls: 'bg-[#FBF5E6] text-[#8B7030]' },
  bad:  { label: 'Expiring!', cls: 'bg-[#F8EDE7] text-[#8B4E32]' },
}

export default function PantryPage({ toast }: { toast: (m: string) => void }) {
  const { pantry, addPantryItem, removePantryItem } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [status, setStatus] = useState<PantryStatus>('good')

  const expiring = pantry.filter((p) => p.status === 'bad')

  function handleAdd() {
    if (!name.trim()) { toast('Please enter an item name'); return }
    addPantryItem({ id: Date.now(), name: name.trim(), qty: qty || '1', status })
    setName(''); setQty(''); setStatus('good')
    setShowAdd(false)
    toast('Pantry item added ✓')
  }

  return (
    <div className="p-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-normal">Pantry</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">Track what you have, reduce waste</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
        >
          + Add item
        </button>
      </div>

      {expiring.length > 0 && (
        <div className="flex items-center gap-3 bg-[#F8EDE7] border border-[#C4714A]/40 rounded-[12px] px-4 py-3 mb-6">
          <span className="text-xl">⚠️</span>
          <div>
            <span className="text-[13px] font-medium text-[#8B4E32]">Use these up soon: </span>
            <span className="text-[13px] text-[#8B4E32]">{expiring.map((p) => p.name).join(', ')}</span>
          </div>
        </div>
      )}

      {pantry.length === 0 ? (
        <div className="text-center py-16 text-[#6B6357]">
          <div className="text-5xl mb-3">🥫</div>
          <div className="text-[14px]">Pantry is empty — add items to track</div>
        </div>
      ) : (
        <div className="space-y-2">
          {pantry.map((item) => {
            const { label, cls } = STATUS_MAP[item.status]
            return (
              <div key={item.id} className="flex items-center gap-3 bg-[#FAF8F3] border border-[#E8E3DB] rounded-[8px] px-4 py-2.5">
                <span className="flex-1 text-[13px]">{item.name}</span>
                <span className="text-[12px] text-[#6B6357] mr-2">{item.qty}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                <button onClick={() => removePantryItem(item.id)} className="text-[#A89E93] hover:text-[#1C1A15] transition-colors ml-1">
                  <X size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Pantry Item" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Item Name</label>
              <input
                className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                placeholder="e.g. Canned tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Quantity</label>
                <input
                  className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                  placeholder="e.g. 3 cans"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Status</label>
                <select
                  className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E] bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PantryStatus)}
                >
                  <option value="good">Fresh / Good</option>
                  <option value="warn">Use soon</option>
                  <option value="bad">Expiring!</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-[#7A9E7E] text-white font-medium py-2.5 rounded-[8px] hover:bg-[#4A6B4E] transition-colors text-[13px]"
            >
              Add Item
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
