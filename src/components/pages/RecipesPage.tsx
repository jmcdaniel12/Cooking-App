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
  const filtered = recipeFilter === 'all' ? recipes : recipes.filter(r => r.tags.includes(recipeFilter))

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0, color: '#1A1714' }}>Recipes</h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>{recipes.length} saved</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ padding: '10px 20px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}
        >
          New Recipe
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setRecipeFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 40,
              fontSize: 11,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-jost)',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: recipeFilter === f ? '#1A1714' : '#DDD6C8',
              background: recipeFilter === f ? '#1A1714' : 'transparent',
              color: recipeFilter === f ? '#F5F0E8' : '#9C9285',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9C9285' }}>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 24, marginBottom: 8 }}>No recipes match</div>
          <div style={{ fontSize: 13 }}>Try a different filter or add a new recipe</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
          {filtered.map(r => (
            <RecipeCard key={r.id} recipe={r} onClick={() => setDetailRecipe(r)} />
          ))}
        </div>
      )}

      {detailRecipe && <RecipeDetailModal recipe={detailRecipe} onClose={() => setDetailRecipe(null)} toast={toast} />}
      {showAdd && <AddRecipeModal onClose={() => setShowAdd(false)} toast={toast} />}
    </div>
  )
}
