'use client'
import { useStore, Recipe } from '@/store'
import Modal from '../ui/Modal'
import { Clock, Users, ShoppingCart, CalendarDays, Trash2 } from 'lucide-react'

interface Props {
  recipe: Recipe
  onClose: () => void
  toast: (m: string) => void
}

export default function RecipeDetailModal({ recipe, onClose, toast }: Props) {
  const { deleteRecipe, addRecipeToGrocery, setPage } = useStore()

  function handleAddToGrocery() {
    addRecipeToGrocery(recipe.id)
    toast(`${recipe.ingredients.length} ingredients added to grocery list`)
    onClose()
    setPage('grocery')
  }

  function handleDelete() {
    deleteRecipe(recipe.id)
    toast('Recipe deleted')
    onClose()
  }

  function handleAddToPlanner() {
    onClose()
    setPage('planner')
    toast('Pick a day and slot in the planner')
  }

  return (
    <Modal title={recipe.name} onClose={onClose}>
      {/* Photo or emoji */}
      {recipe.photo ? (
        <img src={recipe.photo} alt={recipe.name} className="w-full h-48 object-cover rounded-[12px] mb-5" />
      ) : (
        <div className="text-center text-6xl mb-4">{recipe.emoji}</div>
      )}

      {/* Tags + meta */}
      <div className="flex gap-2 flex-wrap mb-3">
        {recipe.tags.map((t) => (
          <span key={t} className="text-[11px] bg-[#EDF3EE] text-[#4A6B4E] px-2 py-0.5 rounded-full font-medium">{t}</span>
        ))}
        <span className="text-[11px] bg-[#FBF5E6] text-[#8B7030] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock size={10} /> {recipe.time} min
        </span>
        <span className="text-[11px] bg-[#F8EDE7] text-[#8B4E32] px-2 py-0.5 rounded-full flex items-center gap-1">
          <Users size={10} /> {recipe.servings} servings
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={handleAddToPlanner}
          className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[12px] font-medium px-3 py-1.5 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
        >
          <CalendarDays size={13} /> Add to week plan
        </button>
        <button
          onClick={handleAddToGrocery}
          className="flex items-center gap-1.5 border border-[#D0C8BC] text-[#6B6357] text-[12px] font-medium px-3 py-1.5 rounded-[8px] hover:bg-[#E8E3DB] transition-colors"
        >
          <ShoppingCart size={13} /> Add to grocery
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 border border-[#D0C8BC] text-[#C4714A] text-[12px] font-medium px-3 py-1.5 rounded-[8px] hover:bg-[#F8EDE7] transition-colors ml-auto"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      {/* Ingredients */}
      <div className="mb-5">
        <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-2">Ingredients</div>
        <div className="divide-y divide-[#E8E3DB]">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="py-1.5 text-[13px]">• {ing}</div>
          ))}
          {recipe.ingredients.length === 0 && <div className="text-[13px] text-[#A89E93]">No ingredients listed</div>}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-5">
        <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-2">Steps</div>
        <div className="divide-y divide-[#E8E3DB]">
          {recipe.steps.map((step, i) => (
            <div key={i} className="py-2 text-[13px] flex gap-3">
              <span className="w-5 h-5 bg-[#7A9E7E] text-white rounded-full flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
          {recipe.steps.length === 0 && <div className="text-[13px] text-[#A89E93]">No steps listed</div>}
        </div>
      </div>

      {/* Notes */}
      {recipe.notes && (
        <div className="bg-[#FBF5E6] rounded-[8px] px-4 py-3 text-[13px] text-[#8B7030]">
          💡 {recipe.notes}
        </div>
      )}
    </Modal>
  )
}
