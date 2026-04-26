'use client'
import { useRef, useState } from 'react'
import { useStore, Recipe } from '@/store'
import Modal from '../ui/Modal'

interface Props {
  recipe: Recipe
  onClose: () => void
  toast: (m: string) => void
}

export default function RecipeDetailModal({ recipe, onClose, toast }: Props) {
  const { deleteRecipe, addRecipeToGrocery, setPage, recipes, addRecipe } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const photo = ev.target?.result as string
      // Update photo by replacing recipe
      const updated = { ...recipe, photo }
      const store = useStore.getState()
      store.deleteRecipe(recipe.id)
      store.addRecipe(updated)
      toast('Photo updated')
      onClose()
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

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

  const btnStyle = (variant: 'dark' | 'light' | 'danger'): React.CSSProperties => ({
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 11,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-jost)',
    cursor: 'pointer',
    border: variant === 'light' ? '1px solid #DDD6C8' : 'none',
    background: variant === 'dark' ? '#1A1714' : variant === 'danger' ? '#F5EAE3' : 'transparent',
    color: variant === 'dark' ? '#F5F0E8' : variant === 'danger' ? '#B5623A' : '#5C5549',
  })

  return (
    <Modal title={recipe.name} onClose={onClose} wide>
      {/* Photo area */}
      <div style={{ marginBottom: 24 }}>
        {recipe.photo ? (
          <div style={{ position: 'relative' }}>
            <img src={recipe.photo} alt={recipe.name} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 12, right: 12,
                background: 'rgba(26,23,20,0.65)', color: 'white',
                border: 'none', borderRadius: 6, padding: '7px 14px',
                fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-jost)',
              }}
            >
              Change photo
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? '#6B8F71' : '#C8BEB0'}`,
              borderRadius: 10,
              padding: '36px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? '#E8EFE9' : '#EDE6D8',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 4 }}>
              Add a photo
            </div>
            <div style={{ fontSize: 11, color: '#C8BEB0' }}>Drop image or click to upload</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
      </div>

      {/* Tags + meta */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {recipe.tags.map(t => (
          <span key={t} style={{ fontSize: 10, background: '#E8EFE9', color: '#3D5C42', padding: '3px 10px', borderRadius: 20, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{t}</span>
        ))}
        <span style={{ fontSize: 10, background: '#EDE6D8', color: '#9C9285', padding: '3px 10px', borderRadius: 20 }}>{recipe.time} min</span>
        <span style={{ fontSize: 10, background: '#EDE6D8', color: '#9C9285', padding: '3px 10px', borderRadius: 20 }}>{recipe.servings} servings</span>
        <span style={{ fontSize: 10, background: '#EDE6D8', color: '#9C9285', padding: '3px 10px', borderRadius: 20 }}>{recipe.cuisine}</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button style={btnStyle('dark')} onClick={() => { onClose(); setPage('planner'); toast('Pick a day in the planner') }}>Add to planner</button>
        <button style={btnStyle('light')} onClick={handleAddToGrocery}>Add to grocery list</button>
        <button style={{ ...btnStyle('danger'), marginLeft: 'auto' }} onClick={handleDelete}>Delete</button>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #DDD6C8', marginBottom: 20 }} />

      {/* Two-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 12 }}>Ingredients</div>
          {recipe.ingredients.length === 0
            ? <div style={{ fontSize: 13, color: '#C8BEB0' }}>None listed</div>
            : recipe.ingredients.map((ing, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: '1px solid #EDE6D8', fontSize: 13, color: '#1A1714' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#9C9285', flexShrink: 0, marginTop: 7 }} />
                  {ing}
                </div>
              ))
          }
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 12 }}>Steps</div>
          {recipe.steps.length === 0
            ? <div style={{ fontSize: 13, color: '#C8BEB0' }}>None listed</div>
            : recipe.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #EDE6D8', fontSize: 13 }}>
                  <span style={{ fontSize: 10, color: '#9C9285', minWidth: 18, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: '#1A1714' }}>{step}</span>
                </div>
              ))
          }
        </div>
      </div>

      {recipe.notes && (
        <div style={{ marginTop: 20, background: '#EDE6D8', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: '#5C5549', borderLeft: '3px solid #A8843E' }}>
          {recipe.notes}
        </div>
      )}
    </Modal>
  )
}
