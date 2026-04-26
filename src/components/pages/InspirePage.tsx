'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import RecipeCard from '../RecipeCard'
import RecipeDetailModal from '../modals/RecipeDetailModal'
import AddRecipeModal from '../modals/AddRecipeModal'
import { Recipe } from '@/store'

const MOODS = [
  { emoji: '🌿', name: 'Something light & fresh', desc: 'Salads, grain bowls, light soups', filter: 'vegetarian' },
  { emoji: '🔥', name: 'Quick & satisfying', desc: 'Under 20 minutes', filter: 'quick' },
  { emoji: '🥩', name: 'Hearty protein meal', desc: 'Chicken, beef, or seafood', filter: 'protein' },
  { emoji: '🌱', name: 'Plant-based tonight', desc: 'Vegan or vegetarian', filter: 'vegan' },
  { emoji: '🍳', name: 'Breakfast for dinner', desc: 'Eggs, oats, morning favorites', filter: 'breakfast' },
  { emoji: '🌍', name: 'Global flavors', desc: 'Surprise me with something new', filter: 'all' },
]

export default function InspirePage({ toast }: { toast: (m: string) => void }) {
  const { recipes, leftovers, grocery, pantry, setPage, setRecipeFilter } = useStore()
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  function pickMood(filter: string) {
    setRecipeFilter(filter)
    setPage('recipes')
  }

  return (
    <div className="p-8 pb-16">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="font-display text-[28px] font-normal">What's cooking?</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">{today} — get inspired for your next meal</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
        >
          + New Recipe
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { num: recipes.length, label: 'saved recipes' },
          { num: leftovers.length, label: 'leftovers' },
          { num: grocery.filter((g) => !g.checked).length, label: 'items to buy' },
          { num: pantry.filter((p) => p.status === 'bad').length, label: 'expiring soon' },
        ].map(({ num, label }) => (
          <div key={label} className="flex items-center gap-1.5 bg-[#FFFEF9] border border-[#E8E3DB] rounded-full px-3.5 py-1.5">
            <span className="font-medium text-[15px]">{num}</span>
            <span className="text-[11px] text-[#6B6357]">{label}</span>
          </div>
        ))}
      </div>

      {/* Leftovers alert */}
      {leftovers.length > 0 && (
        <div className="mb-8">
          <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-3.5">Use up leftovers first</div>
          <div className="flex gap-2.5 flex-wrap">
            {leftovers.map((l) => (
              <div key={l.id} className="flex items-center gap-3 bg-[#FFFEF9] border border-[#E8E3DB] rounded-[12px] px-4 py-3 flex-1 min-w-[200px]">
                <span className="text-3xl">{l.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-[14px]">{l.name}</div>
                  <div className="text-[11px] text-[#6B6357]">{l.date}</div>
                </div>
                <span className="text-[11px] bg-[#EDF3EE] text-[#4A6B4E] px-2 py-0.5 rounded-full">
                  {l.servings} serving{l.servings !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood grid */}
      <div className="mb-8">
        <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px] mb-3.5">What are you in the mood for?</div>
        <div className="grid grid-cols-3 gap-4">
          {MOODS.map((m) => (
            <div
              key={m.filter}
              onClick={() => pickMood(m.filter)}
              className="bg-[#FFFEF9] border border-[#E8E3DB] rounded-[18px] p-5 cursor-pointer text-center hover:border-[#7A9E7E] hover:shadow-card transition-all"
            >
              <div className="text-4xl mb-2.5">{m.emoji}</div>
              <div className="font-display text-[16px] mb-1">{m.name}</div>
              <div className="text-[12px] text-[#6B6357]">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent recipes */}
      <div>
        <div className="flex justify-between items-center mb-3.5">
          <div className="text-[11px] font-medium text-[#A89E93] uppercase tracking-[1.5px]">Recent recipes</div>
          <button onClick={() => setPage('recipes')} className="text-[12px] text-[#4A6B4E] hover:underline">View all →</button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {recipes.slice(0, 4).map((r) => (
            <RecipeCard key={r.id} recipe={r} onClick={() => setDetailRecipe(r)} />
          ))}
        </div>
      </div>

      {detailRecipe && (
        <RecipeDetailModal recipe={detailRecipe} onClose={() => setDetailRecipe(null)} toast={toast} />
      )}
      {showAdd && <AddRecipeModal onClose={() => setShowAdd(false)} toast={toast} />}
    </div>
  )
}
