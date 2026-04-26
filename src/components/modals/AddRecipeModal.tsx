'use client'
import { useState, useRef } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'

export default function AddRecipeModal({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const { addRecipe } = useStore()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [cuisine, setCuisine] = useState('')
  const [time, setTime] = useState('30')
  const [servings, setServings] = useState('4')
  const [tags, setTags] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!name.trim()) { toast('Please enter a recipe name'); return }
    addRecipe({
      id: Date.now(),
      name: name.trim(),
      emoji,
      cuisine: cuisine || 'Other',
      time: parseInt(time) || 30,
      servings: parseInt(servings) || 4,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      ingredients: ingredients.split('\n').map((t) => t.trim()).filter(Boolean),
      steps: steps.split('\n').map((t) => t.trim()).filter(Boolean),
      notes,
      photo,
    })
    toast('Recipe saved! ✓')
    onClose()
  }

  return (
    <Modal title="Add New Recipe" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Recipe Name</label>
          <input
            className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
            placeholder="e.g. Lemon Garlic Shrimp"
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
            <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Cuisine</label>
            <input
              className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
              placeholder="e.g. Italian"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Cook Time (mins)</label>
            <input
              type="number"
              className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Servings</label>
            <input
              type="number"
              className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Tags (comma separated)</label>
          <input
            className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
            placeholder="dinner, quick, vegetarian"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Ingredients (one per line)</label>
          <textarea
            rows={4}
            className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E] resize-none"
            placeholder={'chicken, 2 lbs\ngarlic, 3 cloves\nlemon, 1'}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Steps (one per line)</label>
          <textarea
            rows={4}
            className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E] resize-none"
            placeholder={'Preheat oven to 400°F\nSeason the chicken\nBake 35 minutes'}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Notes</label>
          <input
            className="w-full border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
            placeholder="Tips, variations, pairings..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[12px] font-medium text-[#6B6357] uppercase tracking-[0.5px] mb-1.5">Photo (optional)</label>
          {photo ? (
            <div className="relative">
              <img src={photo} alt="preview" className="w-full h-40 object-cover rounded-[8px]" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-[12px] hover:bg-black/70"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[#D0C8BC] rounded-[8px] p-6 text-center cursor-pointer hover:border-[#7A9E7E] hover:bg-[#EDF3EE] transition-colors"
            >
              <div className="text-3xl mb-2">📷</div>
              <div className="text-[13px] text-[#6B6357]">Click to upload a photo</div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#7A9E7E] text-white font-medium py-3 rounded-[8px] hover:bg-[#4A6B4E] transition-colors text-[13px]"
        >
          Save Recipe
        </button>
      </div>
    </Modal>
  )
}
