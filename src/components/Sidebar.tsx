'use client'
import { useStore } from '@/store'
import { Sun, CalendarDays, BookOpen, ShoppingCart, Package, Refrigerator } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { id: 'inspire', label: 'Inspire Me', icon: Sun },
  { id: 'planner', label: 'Week Planner', icon: CalendarDays },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
]

const NAV2 = [
  { id: 'pantry', label: 'Pantry', icon: Package },
  { id: 'leftovers', label: 'Leftovers', icon: Refrigerator },
]

export default function Sidebar() {
  const { currentPage, setPage } = useStore()

  return (
    <aside className="w-[200px] min-w-[200px] bg-[#1C1A15] flex flex-col overflow-y-auto">
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="font-display text-[#FAF8F3] text-[20px] italic">Mise en Place</div>
        <div className="text-[10px] text-white/35 tracking-[2px] uppercase mt-0.5">Meal Planner</div>
      </div>

      <nav className="py-3 flex-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={clsx(
              'w-full flex items-center gap-2.5 px-5 py-[11px] text-[13px] text-left transition-all border-l-2',
              currentPage === id
                ? 'text-[#FAF8F3] border-l-[#7A9E7E] bg-[#7A9E7E]/12'
                : 'text-white/50 border-l-transparent hover:text-white/85 hover:bg-white/4'
            )}
          >
            <Icon size={15} className="flex-shrink-0" strokeWidth={1.5} />
            {label}
          </button>
        ))}

        <div className="px-5 pt-4 pb-1.5 text-[9px] tracking-[2px] uppercase text-white/20">Kitchen</div>

        {NAV2.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={clsx(
              'w-full flex items-center gap-2.5 px-5 py-[11px] text-[13px] text-left transition-all border-l-2',
              currentPage === id
                ? 'text-[#FAF8F3] border-l-[#7A9E7E] bg-[#7A9E7E]/12'
                : 'text-white/50 border-l-transparent hover:text-white/85 hover:bg-white/4'
            )}
          >
            <Icon size={15} className="flex-shrink-0" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
