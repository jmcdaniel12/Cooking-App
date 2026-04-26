'use client'
import { useState } from 'react'
import { useStore } from '@/store'
import Modal from '../ui/Modal'

type Stage = 'input' | 'loading' | 'preview' | 'error'

interface ParsedRecipe {
  name: string
  cuisine: string
  time: number
  servings: number
  tags: string[]
  ingredients: string[]
  steps: string[]
  notes: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #DDD6C8',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  fontFamily: 'var(--font-jost)',
  color: '#1A1714',
  background: '#FAF7F2',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 500,
  color: '#9C9285',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: 6,
  fontFamily: 'var(--font-jost)',
}

const btnDark: React.CSSProperties = {
  padding: '11px 22px',
  background: '#1A1714',
  color: '#F5F0E8',
  border: 'none',
  borderRadius: 8,
  fontSize: 11,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-jost)',
  cursor: 'pointer',
}

const btnLight: React.CSSProperties = {
  ...btnDark,
  background: 'transparent',
  border: '1px solid #DDD6C8',
  color: '#5C5549',
}

export default function ImportRecipeModal({
  onClose,
  toast,
}: {
  onClose: () => void
  toast: (m: string) => void
}) {
  const { addRecipe } = useStore()
  const [url, setUrl] = useState('')
  const [stage, setStage] = useState<Stage>('input')
  const [errorMsg, setErrorMsg] = useState('')
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null)

  // Editable preview fields
  const [name, setName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('')
  const [tags, setTags] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [notes, setNotes] = useState('')

  async function handleImport() {
    if (!url.trim()) return
    setStage('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Something went wrong')
        setStage('error')
        return
      }

      const r: ParsedRecipe = data.recipe
      setRecipe(r)
      setName(r.name || '')
      setCuisine(r.cuisine || '')
      setTime(String(r.time || 30))
      setServings(String(r.servings || 4))
      setTags((r.tags || []).join(', '))
      setIngredients((r.ingredients || []).join('\n'))
      setSteps((r.steps || []).join('\n'))
      setNotes(r.notes || '')
      setStage('preview')
    } catch {
      setErrorMsg('Network error — please try again')
      setStage('error')
    }
  }

  function handleSave() {
    if (!name.trim()) { toast('Recipe needs a name'); return }
    addRecipe({
      id: Date.now(),
      name: name.trim(),
      emoji: '—',
      cuisine: cuisine || 'Other',
      time: parseInt(time) || 30,
      servings: parseInt(servings) || 4,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.split('\n').map(t => t.trim()).filter(Boolean),
      steps: steps.split('\n').map(t => t.trim()).filter(Boolean),
      notes,
      photo: null,
    })
    toast('Recipe imported')
    onClose()
  }

  return (
    <Modal title="Import from URL" onClose={onClose} wide>
      {/* INPUT STAGE */}
      {(stage === 'input' || stage === 'error') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#EDE6D8', borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#5C5549', lineHeight: 1.7, fontFamily: 'var(--font-jost)' }}>
              Paste a link to any recipe page — from NYT Cooking, Serious Eats, AllRecipes, a food blog, or anywhere else.
              Claude will read the page and extract the ingredients and steps automatically.
            </p>
          </div>

          {stage === 'error' && (
            <div style={{ background: '#F5EAE3', border: '1px solid rgba(181,98,58,0.3)', borderRadius: 8, padding: '12px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#8B3A1E', fontFamily: 'var(--font-jost)' }}>{errorMsg}</p>
            </div>
          )}

          <div>
            <span style={labelStyle}>Recipe URL</span>
            <input
              style={inputStyle}
              type="url"
              placeholder="https://www.seriouseats.com/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleImport()}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleImport} style={{ ...btnDark, flex: 1, justifyContent: 'center' }} disabled={!url.trim()}>
              Import Recipe
            </button>
            {stage === 'error' && (
              <button onClick={() => setStage('input')} style={btnLight}>Try again</button>
            )}
          </div>

          <p style={{ margin: 0, fontSize: 11, color: '#C8BEB0', fontFamily: 'var(--font-jost)', textAlign: 'center' }}>
            Works with most recipe websites. Some sites that block automated access may not work.
          </p>
        </div>
      )}

      {/* LOADING STAGE */}
      {stage === 'loading' && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ marginBottom: 20 }}>
            <LoadingDots />
          </div>
          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 22, color: '#1A1714', marginBottom: 6 }}>
            Reading the recipe
          </div>
          <div style={{ fontSize: 12, color: '#9C9285', fontFamily: 'var(--font-jost)' }}>
            Fetching the page and extracting ingredients and steps…
          </div>
        </div>
      )}

      {/* PREVIEW STAGE */}
      {stage === 'preview' && recipe && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#E8EFE9', borderRadius: 8, padding: '10px 16px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#3D5C42', fontFamily: 'var(--font-jost)' }}>
              Recipe extracted — review and edit anything before saving.
            </p>
          </div>

          <div>
            <span style={labelStyle}>Recipe name</span>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={labelStyle}>Cuisine</span>
              <input style={inputStyle} value={cuisine} onChange={e => setCuisine(e.target.value)} />
            </div>
            <div>
              <span style={labelStyle}>Tags (comma separated)</span>
              <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={labelStyle}>Cook time (minutes)</span>
              <input type="number" style={inputStyle} value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div>
              <span style={labelStyle}>Servings</span>
              <input type="number" style={inputStyle} value={servings} onChange={e => setServings(e.target.value)} />
            </div>
          </div>

          <div>
            <span style={labelStyle}>Ingredients (one per line)</span>
            <textarea
              rows={6}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
            />
          </div>

          <div>
            <span style={labelStyle}>Steps (one per line)</span>
            <textarea
              rows={7}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={steps}
              onChange={e => setSteps(e.target.value)}
            />
          </div>

          {notes && (
            <div>
              <span style={labelStyle}>Notes</span>
              <input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
            <button onClick={handleSave} style={{ ...btnDark, flex: 1 }}>
              Save Recipe
            </button>
            <button onClick={() => { setStage('input'); setUrl('') }} style={btnLight}>
              Try another URL
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#6B8F71',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
