'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import RecipeCard from '../RecipeCard'
import RecipeDetailModal from '../modals/RecipeDetailModal'
import AddRecipeModal from '../modals/AddRecipeModal'
import { Recipe } from '@/store'

const MOODS = [
  { name: 'Light & fresh',       desc: 'Salads, grain bowls, broth-based soups', filter: 'vegetarian' },
  { name: 'Quick & satisfying',  desc: 'Ready in under 20 minutes',               filter: 'quick'      },
  { name: 'Hearty protein',      desc: 'Chicken, beef, seafood',                  filter: 'protein'    },
  { name: 'Plant-based',         desc: 'Vegan or vegetarian',                     filter: 'vegan'      },
  { name: 'Breakfast for dinner',desc: 'Eggs, oats, morning classics',            filter: 'breakfast'  },
  { name: 'Something new',       desc: 'Explore the full collection',             filter: 'all'        },
]

const sec: React.CSSProperties = {
  fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
  color: '#9C9285', marginBottom: 14, fontFamily: 'var(--font-jost)',
}

export default function InspirePage({ toast }: { toast: (m: string) => void }) {
  const { recipes, leftovers, grocery, pantry, setPage, setRecipeFilter } = useStore()
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0, color: '#1A1714', letterSpacing: 0.3 }}>
            What shall we cook?
          </h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>{today}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ padding: '10px 20px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 8, fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}
        >
          New Recipe
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
        {[
          { num: recipes.length,                              label: 'Recipes'        },
          { num: leftovers.length,                            label: 'Leftovers'      },
          { num: grocery.filter(g => !g.checked).length,     label: 'To buy'         },
          { num: pantry.filter(p => p.status === 'bad').length, label: 'Expiring'    },
        ].map(({ num, label }) => (
          <div key={label} style={{ background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 40, padding: '7px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 20, color: '#1A1714' }}>{num}</span>
            <span style={{ fontSize: 11, color: '#9C9285', letterSpacing: '0.5px' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Leftovers */}
      {leftovers.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={sec}>Use up first</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {leftovers.map(l => (
              <div key={l.id} style={{ flex: 1, minWidth: 200, background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 17, color: '#1A1714' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: '#9C9285', marginTop: 2 }}>{l.date}</div>
                </div>
                <div style={{ fontSize: 11, background: '#E8EFE9', color: '#3D5C42', padding: '3px 10px', borderRadius: 20 }}>
                  {l.servings} serving{l.servings !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood grid */}
      <div style={{ marginBottom: 40 }}>
        <div style={sec}>What are you in the mood for?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {MOODS.map(m => (
            <div
              key={m.filter}
              onClick={() => { setRecipeFilter(m.filter); setPage('recipes') }}
              style={{
                background: '#FAF7F2', border: '1px solid #DDD6C8', borderRadius: 14,
                padding: '20px 22px', cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#6B8F71'
                ;(e.currentTarget as HTMLDivElement).style.background = '#F0F5F1'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#DDD6C8'
                ;(e.currentTarget as HTMLDivElement).style.background = '#FAF7F2'
              }}
            >
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 19, color: '#1A1714', marginBottom: 5 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#9C9285' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent recipes */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={sec}>Recent recipes</div>
          <button onClick={() => setPage('recipes')} style={{ fontSize: 11, color: '#6B8F71', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.5px' }}>View all</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
          {recipes.slice(0, 4).map(r => (
            <RecipeCard key={r.id} recipe={r} onClick={() => setDetailRecipe(r)} />
          ))}
        </div>
      </div>

      {detailRecipe && <RecipeDetailModal recipe={detailRecipe} onClose={() => setDetailRecipe(null)} toast={toast} />}
      {showAdd && <AddRecipeModal onClose={() => setShowAdd(false)} toast={toast} />}
    </div>
  )
}
