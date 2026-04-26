'use client'
import { useState } from 'react'
import { useStore, Day, MealType } from '@/store'
import MealPickerModal from '../modals/MealPickerModal'

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner']

export default function PlannerPage({ toast }: { toast: (m: string) => void }) {
  const { weekPlan, recipes, removeMeal, addWeekToGrocery } = useStore()
  const [picking, setPicking] = useState<{ day: Day; meal: MealType } | null>(null)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)

  function handleAddWeek() {
    const count = addWeekToGrocery()
    toast(`${count} ingredient${count !== 1 ? 's' : ''} added to grocery list`)
  }

  return (
    <div style={{ padding: '36px 40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 36, fontWeight: 400, margin: 0 }}>Week Planner</h1>
          <p style={{ color: '#9C9285', fontSize: 13, marginTop: 4, fontFamily: 'var(--font-jost)' }}>Plan meals, track what's on the menu</p>
        </div>
        <button
          onClick={handleAddWeek}
          style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #DDD6C8', color: '#5C5549', borderRadius: 8, fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', fontFamily: 'var(--font-jost)', cursor: 'pointer' }}
        >
          Add week to grocery list
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
        {DAYS.map(day => {
          const isToday = day === today
          return (
            <div
              key={day}
              style={{
                background: '#FAF7F2',
                border: `1px solid ${isToday ? '#6B8F71' : '#DDD6C8'}`,
                borderRadius: 12,
                padding: 12,
                minHeight: 170,
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: isToday ? '#3D5C42' : '#9C9285', marginBottom: 10, fontFamily: 'var(--font-jost)' }}>
                {day}{isToday ? ' ·' : ''}
              </div>
              {MEALS.map(meal => {
                const recipeId = weekPlan[day][meal]
                const recipe = recipeId ? recipes.find(r => r.id === recipeId) : null
                return recipe ? (
                  <div
                    key={meal}
                    onClick={() => removeMeal(day, meal)}
                    title="Click to remove"
                    style={{
                      padding: '7px 9px', borderRadius: 6, fontSize: 11, marginBottom: 6,
                      border: '1px solid #E8E3DB', background: '#F5F0E8', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#B5623A'; (e.currentTarget as HTMLDivElement).style.background = '#F5EAE3' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E8E3DB'; (e.currentTarget as HTMLDivElement).style.background = '#F5F0E8' }}
                  >
                    <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '1px', color: '#9C9285', marginBottom: 2 }}>{meal}</div>
                    <div style={{ fontSize: 11, color: '#1A1714', lineHeight: 1.3, fontFamily: 'var(--font-jost)' }}>{recipe.name}</div>
                  </div>
                ) : (
                  <div
                    key={meal}
                    onClick={() => setPicking({ day, meal })}
                    style={{
                      padding: '7px 9px', borderRadius: 6, fontSize: 10, marginBottom: 6,
                      border: '1px dashed #C8BEB0', color: '#9C9285', textAlign: 'center',
                      cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.5px',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6B8F71'; (e.currentTarget as HTMLDivElement).style.color = '#3D5C42' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C8BEB0'; (e.currentTarget as HTMLDivElement).style.color = '#9C9285' }}
                  >
                    + {meal}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <p style={{ fontSize: 11, color: '#C8BEB0', marginTop: 12, fontFamily: 'var(--font-jost)' }}>Click a filled slot to remove it. Click an empty slot to assign a recipe.</p>

      {picking && (
        <MealPickerModal day={picking.day} meal={picking.meal} onClose={() => setPicking(null)} toast={toast} />
      )}
    </div>
  )
}
