'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'
import { X } from 'lucide-react'

export default function LeftoversPage({ toast }: { toast: (m: string) => void }) {
  const { leftovers, addLeftover, removeLeftover, addRecipe, setPage } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍱')
  const [servings, setServings] = useState('2')
  const [note, setNote] = useState('')

  function handleAdd() {
    if (!name.trim()) { toast('Please enter a meal name'); return }
    addLeftover({ id: Date.now(), name: name.trim(), emoji, date: 'Just now', servings: parseInt(servings) || 1, note })
    setName(''); setEmoji('🍱'); setServings('2'); setNote('')
    setShowAdd(false)
    toast('Leftover added ✓')
  }

  function handleAddToPlanner(id: number) {
    const l = leftovers.find((x) => x.id === id)
    if (!l) return
    addRecipe({
      id: Date.now(),
      name: `${l.name} (leftover)`,
      emoji: l.emoji,
      cuisine: 'Leftover',
      time: 10,
      servings: l.servings,
      tags: ['leftover'],
      ingredients: [],
      steps: [],
      photo: null,
      notes: l.note,
    })
    setPage('planner')
    toast('Added to recipes — now assign it to a day!')
  }

  return (
    <div className="p-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-normal">Leftovers</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">Track what's in the fridge, reduce waste</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
        >
          + Add leftover
        </button>
      </div>

      {leftovers.length === 0 ? (
        <div className="text-center py-16 text-[#6B6357]">
          <div className="text-5xl mb-3">🍱</div>
          <div className="text-[14px]">No leftovers tracked — add what's in your fridge</div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {leftovers.map((l) => (
            <div key={l.id} className="flex items-center gap-3 bg-[#FFFEF9] border border-[#E8E3DB] rounded-[12px] px-4 py-3">
              <span className="text-3xl">{l.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-[14px]">{l.name}</div>
                <div className="text-[11px] text-[#6B6357]">{l.date}{l.note ? ` · ${l.note}` : ''}</div>
              </div>
              <span className="text-[11px] bg-[#EDF3EE] text-[#4A6B4E] px-2 py-0.5 rounded-full">
                {l.servings} serving{l.servings !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => handleAddToPlanner(l.id)}
                className="ml-2 px-3 py-1.5 text-[12px] font-medium border border-[#D0C8BC] text-[#6B6357] rounded-[8px] hover:bg-[#E8E3DB] transition-colors"
              >
                Add to planner
              </button>
              <button onClick={() => removeLeftover(l.id)} className="text-[#A89E93] hover:text-[#1C1A15] transition-colors ml-1">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Leftover" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Meal Name</label>
              <input
                className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                placeholder="e.g. Chicken Curry"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Emoji</label>
                <input
                  className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[22px] focus:outline-none focus:border-[#7A9E7E]"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Servings Left</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Note (optional)</label>
              <input
                className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                placeholder="In airtight container, reheat with a splash of water..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-[#7A9E7E] text-white font-medium py-2.5 rounded-[8px] hover:bg-[#4A6B4E] transition-colors text-[13px]"
            >
              Add Leftover
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
