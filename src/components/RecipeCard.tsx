import { Recipe } from '@/store'

interface Props {
  recipe: Recipe
  onClick: () => void
}

export default function RecipeCard({ recipe, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#FAF7F2',
        border: '1px solid #DDD6C8',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 36px rgba(26,23,20,0.10)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = '#C8BEB0'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = ''
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
        ;(e.currentTarget as HTMLDivElement).style.borderColor = '#DDD6C8'
      }}
    >
      {/* Photo / placeholder */}
      <div style={{ width: '100%', height: 145, background: '#EDE6D8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {recipe.photo
          ? <img src={recipe.photo} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#9C9285', fontFamily: 'var(--font-jost)' }}>
                {recipe.cuisine}
              </div>
            </div>
          )
        }
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 18, fontWeight: 400, lineHeight: 1.2, marginBottom: 8, color: '#1A1714' }}>
          {recipe.name}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 8 }}>
          {recipe.tags.slice(0, 2).map((t) => (
            <span key={t} style={{ fontSize: 10, background: '#E8EFE9', color: '#3D5C42', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#9C9285', letterSpacing: '0.5px' }}>
          {recipe.time} min &nbsp;·&nbsp; {recipe.servings} servings
        </div>
      </div>
    </div>
  )
}
