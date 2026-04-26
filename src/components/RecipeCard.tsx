import { Recipe } from '@/store'
import { Clock, Users } from 'lucide-react'

interface Props {
  recipe: Recipe
  onClick: () => void
}

export default function RecipeCard({ recipe, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-[#FFFEF9] border border-[#E8E3DB] rounded-[18px] overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,26,21,0.12)] hover:border-[#D0C8BC]"
    >
      <div className="w-full h-36 bg-[#E8E3DB] flex items-center justify-center text-5xl overflow-hidden">
        {recipe.photo
          ? <img src={recipe.photo} alt={recipe.name} className="w-full h-full object-cover" />
          : recipe.emoji}
      </div>
      <div className="p-3.5">
        <div className="font-display text-[15px] font-medium mb-1.5 leading-snug">{recipe.name}</div>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {recipe.tags.map((t) => (
            <span key={t} className="text-[11px] bg-[#EDF3EE] text-[#4A6B4E] px-2 py-0.5 rounded-full font-medium">{t}</span>
          ))}
        </div>
        <div className="flex gap-2.5 text-[11px] text-[#6B6357]">
          <span className="flex items-center gap-1"><Clock size={11} /> {recipe.time}min</span>
          <span className="flex items-center gap-1"><Users size={11} /> {recipe.servings}</span>
          <span>{recipe.cuisine}</span>
        </div>
      </div>
    </div>
  )
}
