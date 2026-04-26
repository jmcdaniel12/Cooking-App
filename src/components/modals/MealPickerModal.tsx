'use client'
import { useState } from 'react'
import { useStore, Day, MealType } from '@/store'
import Modal from '../ui/Modal'
import { Clock } from 'lucide-react'

interface Props {
  day: Day
  meal: MealType
  onClose: () => void
  toast: (m: string) => void
}

export default function MealPickerModal({ day, meal, onClose, toast }: Props) {
  const { recipes, assignMeal, addRecipe } = useStore()
  const [mealOutName, setMealOutName] = useState('')

  function handlePick(recipeId: number) {
    assignMeal(day, meal, recipeId)
    toast('Meal added ✓')
    onClose()
  }

  function handleMealOut() {
    if (!mealOutName.trim()) return
    const newR = {
      id: Date.now(),
      name: mealOutName.trim(),
      emoji: '🍽️',
      cuisine: 'Restaurant',
      time: 0,
      servings: 2,
      tags: ['meal-out'],
      ingredients: [],
      steps: [],
      photo: null,
      notes: '',
    }
    addRecipe(newR)
    assignMeal(day, meal, newR.id)
    toast('Meal out added ✓')
    onClose()
  }

  return (
    <Modal title={`${day} — ${meal}`} onClose={onClose}>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 mb-4">
        {recipes.map((r) => (
          <div
            key={r.id}
            onClick={() => handlePick(r.id)}
            className="flex items-center gap-3 p-3 border border-[#E8E3DB] rounded-[8px] cursor-pointer hover:border-[#7A9E7E] hover:bg-[#EDF3EE]/40 transition-all"
          >
            <span className="text-3xl">{r.emoji}</span>
            <div className="flex-1">
              <div className="font-medium text-[14px]">{r.name}</div>
              <div className="text-[11px] text-[#6B6357] flex items-center gap-1 mt-0.5">
                <Clock size={10} /> {r.time}min · {r.cuisine}
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {r.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-[11px] bg-[#EDF3EE] text-[#4A6B4E] px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E8E3DB] pt-4">
        <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-2">Or log a meal out</div>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-[#D0C8BC] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#7A9E7E]"
            placeholder="Restaurant or meal name"
            value={mealOutName}
            onChange={(e) => setMealOutName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMealOut()}
          />
          <button
            onClick={handleMealOut}
            className="px-4 py-2 border border-[#D0C8BC] text-[#6B6357] text-[13px] rounded-[8px] hover:bg-[#E8E3DB] transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  )
}
