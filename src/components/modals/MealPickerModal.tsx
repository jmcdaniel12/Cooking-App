'use client'
import { useState } from 'react'
import { useStore, Day, MealType } from '@/store'
import Modal from '../ui/Modal'

interface Props { day: Day; meal: MealType; onClose: () => void; toast: (m: string) => void }

export default function MealPickerModal({ day, meal, onClose, toast }: Props) {
  const { recipes, assignMeal, addRecipe } = useStore()
  const [mealOut, setMealOut] = useState('')

  function handlePick(recipeId: number) {
    assignMeal(day, meal, recipeId)
    toast('Meal added')
    onClose()
  }

  function handleMealOut() {
    if (!mealOut.trim()) return
    const newR = { id: Date.now(), name: mealOut.trim(), emoji: '—', cuisine: 'Restaurant', time: 0, servings: 2, tags: ['meal-out'], ingredients: [], steps: [], photo: null, notes: '' }
    addRecipe(newR)
    assignMeal(day, meal, newR.id)
    toast('Meal out added')
    onClose()
  }

  return (
    <Modal title={`${day} — ${meal}`} onClose={onClose}>
      <div style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {recipes.map(r => (
          <div
            key={r.id}
            onClick={() => handlePick(r.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid #DDD6C8', borderRadius: 8, cursor: 'pointer', transition: 'all 0.14s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6B8F71'; (e.currentTarget as HTMLDivElement).style.background = '#F0F5F1' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#DDD6C8'; (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            {r.photo
              ? <img src={r.photo} alt={r.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: 40, height: 40, borderRadius: 6, background: '#EDE6D8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#9C9285', textTransform: 'uppercase', letterSpacing: '1px' }}>{r.cuisine.slice(0, 3)}</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16, color: '#1A1714' }}>{r.name}</div>
              <div style={{ fontSize: 11, color: '#9C9285', marginTop: 1 }}>{r.time > 0 ? `${r.time} min · ` : ''}{r.cuisine}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {r.tags.slice(0, 2).map(t => (
                <span key={t} style={{ fontSize: 10, background: '#E8EFE9', color: '#3D5C42', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #DDD6C8', paddingTop: 18 }}>
        <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 10, fontFamily: 'var(--font-jost)' }}>Or log a meal out</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1, border: '1px solid #DDD6C8', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-jost)', color: '#1A1714', background: '#FAF7F2', outline: 'none' }}
            placeholder="Restaurant or meal name"
            value={mealOut}
            onChange={e => setMealOut(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleMealOut()}
          />
          <button
            onClick={handleMealOut}
            style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549', borderRadius: 8, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  )
}
