'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'
import { X } from 'lucide-react'

const CATEGORIES = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Pantry', 'Frozen', 'From Recipe', 'From Planner', 'Other']

export default function GroceryPage({ toast }: { toast: (m: string) => void }) {
  const { grocery, addGroceryItem, removeGroceryItem, toggleGroceryItem, clearCheckedGrocery } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [category, setCategory] = useState('Produce')

  const unchecked = grocery.filter((g) => !g.checked)
  const cats = Array.from(new Set(grocery.map((g) => g.category)))

  function handleAdd() {
    if (!name.trim()) { toast('Please enter an item name'); return }
    addGroceryItem({ id: Date.now(), name: name.trim(), qty: qty || '1', category, checked: false })
    setName(''); setQty(''); setCategory('Produce')
    setShowAdd(false)
    toast('Item added ✓')
  }

  function handleClear() {
    clearCheckedGrocery()
    toast('Cleared done items')
  }

  return (
    <div className="p-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-normal">Grocery List</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">
            {unchecked.length} items remaining · {grocery.filter((g) => g.checked).length} done
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-[12px] font-medium border border-[#D0C8BC] text-[#6B6357] rounded-[8px] hover:bg-[#E8E3DB] transition-colors"
          >
            Clear done
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
          >
            + Add item
          </button>
        </div>
      </div>

      {grocery.length === 0 ? (
        <div className="text-center py-16 text-[#6B6357]">
          <div className="text-5xl mb-3">🛒</div>
          <div className="text-[14px]">Your grocery list is empty</div>
        </div>
      ) : (
        <div className="space-y-5">
          {cats.map((cat) => {
            const items = grocery.filter((g) => g.category === cat)
            return (
              <div key={cat}>
                <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-3">{cat}</div>
                <div className="bg-[#FFFEF9] border border-[#E8E3DB] rounded-[18px] px-5 divide-y divide-[#E8E3DB]">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2.5">
                      <button
                        onClick={() => toggleGroceryItem(item.id)}
                        className={`w-[18px] h-[18px] flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-all ${
                          item.checked ? 'bg-[#7A9E7E] border-[#7A9E7E]' : 'border-[#D0C8BC]'
                        }`}
                      >
                        {item.checked && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                      <span className={`flex-1 text-[13px] ${item.checked ? 'line-through text-[#A89E93]' : ''}`}>{item.name}</span>
                      <span className="text-[12px] text-[#6B6357]">{item.qty}</span>
                      <button
                        onClick={() => removeGroceryItem(item.id)}
                        className="text-[#A89E93] hover:text-[#1C1A15] transition-colors ml-1"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Grocery Item" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Item Name</label>
              <input
                className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
                placeholder="e.g. Olive oil"
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
                  placeholder="e.g. 1 bottle"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Category</label>
                <select
                  className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E] bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-[#7A9E7E] text-white font-medium py-2.5 rounded-[8px] hover:bg-[#4A6B4E] transition-colors text-[13px]"
            >
              Add to List
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
