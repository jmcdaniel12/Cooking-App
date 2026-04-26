'use client'
import { useState, useRef } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'

const field: React.CSSProperties = {
  width: '100%',
  border: '1px solid #DDD6C8',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  fontFamily: 'var(--font-jost)',
  color: '#1A1714',
  background: '#FAF7F2',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 500,
  color: '#9C9285',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: 6,
  fontFamily: 'var(--font-jost)',
}

export default function AddRecipeModal({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const { addRecipe } = useStore()
  const [name, setName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [time, setTime] = useState('30')
  const [servings, setServings] = useState('4')
  const [tags, setTags] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handlePhotoInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  function handleSave() {
    if (!name.trim()) { toast('Please enter a recipe name'); return }
    addRecipe({
      id: Date.now(),
      name: name.trim(),
      emoji: '—',
      cuisine: cuisine || 'Other',
      time: parseInt(time) || 30,
      servings: parseInt(servings) || 4,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      ingredients: ingredients.split('\n').map((t) => t.trim()).filter(Boolean),
      steps: steps.split('\n').map((t) => t.trim()).filter(Boolean),
      notes,
      photo,
    })
    toast('Recipe saved')
    onClose()
  }

  return (
    <Modal title="New Recipe" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Photo upload */}
        <div>
          <span style={label}>Photo</span>
          {photo ? (
            <div style={{ position: 'relative' }}>
              <img src={photo} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
              <button
                onClick={() => setPhoto(null)}
                style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(26,23,20,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? '#6B8F71' : '#C8BEB0'}`,
                borderRadius: 10,
                padding: '32px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? '#E8EFE9' : '#EDE6D8',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9C9285', marginBottom: 6 }}>
                Drop image here or click to upload
              </div>
              <div style={{ fontSize: 11, color: '#C8BEB0' }}>JPG, PNG, WEBP</div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoInput} />
        </div>

        <div>
          <span style={label}>Recipe Name</span>
          <input style={field} placeholder="e.g. Lemon Garlic Chicken" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span style={label}>Cuisine</span>
            <input style={field} placeholder="e.g. Italian" value={cuisine} onChange={e => setCuisine(e.target.value)} />
          </div>
          <div>
            <span style={label}>Tags (comma separated)</span>
            <input style={field} placeholder="dinner, quick" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span style={label}>Cook time (minutes)</span>
            <input type="number" style={field} value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div>
            <span style={label}>Servings</span>
            <input type="number" style={field} value={servings} onChange={e => setServings(e.target.value)} />
          </div>
        </div>

        <div>
          <span style={label}>Ingredients (one per line, e.g. "chicken, 2 lbs")</span>
          <textarea
            rows={5}
            style={{ ...field, resize: 'none' }}
            placeholder={'chicken thighs, 4\ngarlic, 3 cloves\nlemon, 1'}
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
          />
        </div>

        <div>
          <span style={label}>Steps (one per line)</span>
          <textarea
            rows={5}
            style={{ ...field, resize: 'none' }}
            placeholder={'Preheat oven to 400°F\nSeason chicken with salt and pepper\nRoast 40 minutes until golden'}
            value={steps}
            onChange={e => setSteps(e.target.value)}
          />
        </div>

        <div>
          <span style={label}>Notes</span>
          <input style={field} placeholder="Tips, pairings, variations..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: '#1A1714',
            color: '#F5F0E8',
            border: 'none',
            borderRadius: 8,
            padding: '13px',
            fontSize: 12,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-jost)',
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          Save Recipe
        </button>
      </div>
    </Modal>
  )
}
