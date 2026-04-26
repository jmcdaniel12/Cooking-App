'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import RecipeCard from '../RecipeCard'
import RecipeDetailModal from '../modals/RecipeDetailModal'
import AddRecipeModal from '../modals/AddRecipeModal'
import { Recipe } from '@/store'

const FILTERS = ['all', 'breakfast', 'lunch', 'dinner', 'vegetarian', 'vegan', 'quick', 'protein']

export default function RecipesPage({ toast }: { toast: (m: string) => void }) {
  const { recipes, recipeFilter, setRecipeFilter } = useStore()
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = recipeFilter === 'all' ? recipes : recipes.filter((r) => r.tags.includes(recipeFilter))

  return (
    <div className="p-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-normal">Recipes</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">{recipes.length} saved recipes</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#7A9E7E] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] hover:bg-[#4A6B4E] transition-colors"
        >
          + Add Recipe
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setRecipeFilter(f)}
            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium border transition-colors ${
              recipeFilter === f
                ? 'bg-[#C4714A] text-white border-[#C4714A]'
                : 'bg-transparent border-[#D0C8BC] text-[#6B6357] hover:bg-[#E8E3DB] hover:text-[#1C1A15]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6B6357]">
          <div className="text-5xl mb-3">🍽️</div>
          <div className="text-[14px]">No recipes match this filter</div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} onClick={() => setDetailRecipe(r)} />
          ))}
        </div>
      )}

      {detailRecipe && (
        <RecipeDetailModal recipe={detailRecipe} onClose={() => setDetailRecipe(null)} toast={toast} />
      )}
      {showAdd && <AddRecipeModal onClose={() => setShowAdd(false)} toast={toast} />}
    </div>
  )
}
