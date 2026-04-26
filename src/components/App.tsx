'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import Sidebar from './Sidebar'
import Toast from './ui/Toast'
import { useToast } from '@/hooks/useToast'
import InspirePage from './pages/InspirePage'
import PlannerPage from './pages/PlannerPage'
import RecipesPage from './pages/RecipesPage'
import GroceryPage from './pages/GroceryPage'
import PantryPage from './pages/PantryPage'
import LeftoversPage from './pages/LeftoversPage'

export default function App() {
  const { currentPage } = useStore()
  const { message, toast } = useToast()
  // Prevent hydration mismatch — only render after client mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#FAF8F3', color: '#A89E93', fontSize: '14px',
        fontFamily: 'system-ui',
      }}>
        Loading…
      </div>
    )
  }

  const pages: Record<string, React.ReactNode> = {
    inspire:   <InspirePage toast={toast} />,
    planner:   <PlannerPage toast={toast} />,
    recipes:   <RecipesPage toast={toast} />,
    grocery:   <GroceryPage toast={toast} />,
    pantry:    <PantryPage toast={toast} />,
    leftovers: <LeftoversPage toast={toast} />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FAF8F3' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {pages[currentPage] ?? pages['inspire']}
      </main>
      <Toast message={message} />
    </div>
  )
}
