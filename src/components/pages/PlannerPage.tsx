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
    toast(`${count} ingredients added to grocery list`)
  }

  return (
    <div className="p-8 pb-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-normal">Week Planner</h1>
          <p className="text-[#6B6357] text-[13px] mt-1">Plan meals, track what's on the menu</p>
        </div>
        <button
          onClick={handleAddWeek}
          className="flex items-center gap-1.5 bg-transparent border border-[#D0C8BC] text-[#6B6357] text-[12px] font-medium px-3 py-1.5 rounded-[8px] hover:bg-[#E8E3DB] hover:text-[#1C1A15] transition-colors"
        >
          📋 Add week to grocery list
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {DAYS.map((day) => {
          const isToday = day === today
          return (
            <div
              key={day}
              className={`bg-[#FFFEF9] border rounded-[12px] p-3 min-h-[160px] ${
                isToday ? 'border-[#7A9E7E]' : 'border-[#E8E3DB]'
              }`}
            >
              <div className={`text-[10px] font-medium uppercase tracking-[1px] mb-2.5 ${isToday ? 'text-[#4A6B4E]' : 'text-[#A89E93]'}`}>
                {day}{isToday ? ' · today' : ''}
              </div>
              {MEALS.map((meal) => {
                const recipeId = weekPlan[day][meal]
                const recipe = recipeId ? recipes.find((r) => r.id === recipeId) : null
                return recipe ? (
                  <div
                    key={meal}
                    onClick={() => removeMeal(day, meal)}
                    className="p-1.5 rounded-[6px] text-[11px] mb-1.5 border border-[#E8E3DB] bg-[#FAF8F3] cursor-pointer hover:border-red-200 hover:bg-red-50 transition-colors"
                    title="Click to remove"
                  >
                    <div className="text-[9px] uppercase tracking-[1px] text-[#A89E93] mb-0.5">{meal}</div>
                    <div className="text-[11px] text-[#1C1A15] leading-snug">{recipe.emoji} {recipe.name}</div>
                  </div>
                ) : (
                  <div
                    key={meal}
                    onClick={() => setPicking({ day, meal })}
                    className="p-1.5 rounded-[6px] text-[11px] mb-1.5 border border-dashed border-[#D0C8BC] text-[#A89E93] text-center cursor-pointer hover:border-[#7A9E7E] hover:text-[#7A9E7E] transition-colors"
                  >
                    + {meal}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-[#A89E93] mt-3">Click a filled meal to remove it. Click an empty slot to add a recipe.</p>

      {picking && (
        <MealPickerModal
          day={picking.day}
          meal={picking.meal}
          onClose={() => setPicking(null)}
          toast={toast}
        />
      )}
    </div>
  )
}
