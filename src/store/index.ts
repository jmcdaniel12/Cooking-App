import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Tag = string
export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type PantryStatus = 'good' | 'warn' | 'bad'

export interface Recipe {
  id: number
  name: string
  emoji: string
  cuisine: string
  time: number
  servings: number
  tags: Tag[]
  ingredients: string[]
  steps: string[]
  photo: string | null
  notes: string
}

export interface GroceryItem {
  id: number
  name: string
  qty: string
  category: string
  checked: boolean
}

export interface PantryItem {
  id: number
  name: string
  qty: string
  status: PantryStatus
}

export interface Leftover {
  id: number
  name: string
  emoji: string
  date: string
  servings: number
  note: string
}

export type WeekPlan = Record<Day, Record<MealType, number | null>>

interface AppState {
  currentPage: string
  recipeFilter: string
  recipes: Recipe[]
  weekPlan: WeekPlan
  grocery: GroceryItem[]
  pantry: PantryItem[]
  leftovers: Leftover[]

  setPage: (page: string) => void
  setRecipeFilter: (f: string) => void
  addRecipe: (r: Recipe) => void
  deleteRecipe: (id: number) => void
  assignMeal: (day: Day, meal: MealType, recipeId: number) => void
  removeMeal: (day: Day, meal: MealType) => void
  addGroceryItem: (item: GroceryItem) => void
  removeGroceryItem: (id: number) => void
  toggleGroceryItem: (id: number) => void
  clearCheckedGrocery: () => void
  addPantryItem: (item: PantryItem) => void
  removePantryItem: (id: number) => void
  addLeftover: (item: Leftover) => void
  removeLeftover: (id: number) => void
  addRecipeToGrocery: (recipeId: number) => void
  addWeekToGrocery: () => number
}

const DEFAULT_WEEK: WeekPlan = {
  Mon: { breakfast: null, lunch: null, dinner: null },
  Tue: { breakfast: null, lunch: null, dinner: null },
  Wed: { breakfast: null, lunch: null, dinner: null },
  Thu: { breakfast: null, lunch: null, dinner: null },
  Fri: { breakfast: null, lunch: null, dinner: null },
  Sat: { breakfast: null, lunch: null, dinner: null },
  Sun: { breakfast: null, lunch: null, dinner: null },
}

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 1, name: 'Roasted Lemon Chicken', emoji: '🍋', time: 50, servings: 4,
    tags: ['dinner', 'protein'], cuisine: 'Mediterranean',
    ingredients: ['chicken thighs, 4', 'lemon, 2', 'garlic, 4 cloves', 'olive oil, 3 tbsp', 'thyme, 4 sprigs'],
    steps: ['Preheat oven to 425°F', 'Season chicken with salt, pepper, oil', 'Add lemon slices and garlic', 'Roast 45 minutes until golden'],
    photo: null, notes: 'Rest 5 min before serving',
  },
  {
    id: 2, name: 'Creamy Tomato Pasta', emoji: '🍝', time: 25, servings: 3,
    tags: ['dinner', 'vegetarian'], cuisine: 'Italian',
    ingredients: ['pasta, 300g', 'crushed tomatoes, 1 can', 'heavy cream, ½ cup', 'onion, 1', 'garlic, 3 cloves', 'basil, handful'],
    steps: ['Cook pasta al dente', 'Sauté onion and garlic', 'Add tomatoes, simmer 10 min', 'Stir in cream and basil'],
    photo: null, notes: '',
  },
  {
    id: 3, name: 'Green Shakshuka', emoji: '🥚', time: 20, servings: 2,
    tags: ['breakfast', 'vegetarian'], cuisine: 'Middle Eastern',
    ingredients: ['eggs, 4', 'spinach, 2 cups', 'feta, 100g', 'onion, 1', 'jalapeño, 1', 'cumin, 1 tsp'],
    steps: ['Sauté onion and jalapeño', 'Add spinach until wilted', 'Make wells, crack eggs in', 'Cover and cook 8 min'],
    photo: null, notes: 'Top with feta',
  },
  {
    id: 4, name: 'Miso Glazed Salmon', emoji: '🐟', time: 20, servings: 2,
    tags: ['dinner', 'protein', 'quick'], cuisine: 'Japanese',
    ingredients: ['salmon fillets, 2', 'white miso, 3 tbsp', 'mirin, 2 tbsp', 'soy sauce, 1 tbsp', 'sesame seeds'],
    steps: ['Mix miso, mirin, soy', 'Coat salmon, marinate 30 min', 'Broil 8 min until caramelized'],
    photo: null, notes: 'Great with rice',
  },
  {
    id: 5, name: 'Black Bean Tacos', emoji: '🌮', time: 15, servings: 2,
    tags: ['dinner', 'vegan', 'quick'], cuisine: 'Mexican',
    ingredients: ['black beans, 1 can', 'corn tortillas, 6', 'avocado, 1', 'lime, 1', 'cabbage, 1 cup', 'cumin, 1 tsp'],
    steps: ['Season and heat beans', 'Warm tortillas', 'Assemble with toppings'],
    photo: null, notes: 'Add hot sauce',
  },
  {
    id: 6, name: 'Overnight Oats', emoji: '🥣', time: 5, servings: 1,
    tags: ['breakfast', 'vegan', 'quick'], cuisine: 'Universal',
    ingredients: ['oats, ½ cup', 'almond milk, ¾ cup', 'chia seeds, 1 tbsp', 'banana, 1', 'honey, 1 tbsp'],
    steps: ['Mix oats, milk, chia', 'Add sweetener', 'Refrigerate overnight', 'Top with banana'],
    photo: null, notes: 'Make 5 at once for the week',
  },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'inspire',
      recipeFilter: 'all',
      recipes: DEFAULT_RECIPES,
      weekPlan: DEFAULT_WEEK,
      grocery: [
        { id: 1, name: 'Chicken thighs', qty: '4 pieces', category: 'Meat', checked: false },
        { id: 2, name: 'Lemons', qty: '4', category: 'Produce', checked: false },
        { id: 3, name: 'Pasta', qty: '400g', category: 'Pantry', checked: true },
        { id: 4, name: 'Crushed tomatoes', qty: '2 cans', category: 'Pantry', checked: false },
        { id: 5, name: 'Heavy cream', qty: '1 cup', category: 'Dairy', checked: false },
      ],
      pantry: [
        { id: 1, name: 'Olive oil', qty: 'Full bottle', status: 'good' },
        { id: 2, name: 'Garlic', qty: '1 head', status: 'warn' },
        { id: 3, name: 'Onions', qty: '3', status: 'good' },
        { id: 4, name: 'Pasta', qty: '200g', status: 'good' },
        { id: 5, name: 'Miso paste', qty: 'Half jar', status: 'bad' },
      ],
      leftovers: [
        { id: 1, name: 'Roasted Chicken', emoji: '🍋', date: '2 days ago', servings: 2, note: 'In fridge, airtight container' },
        { id: 2, name: 'Tomato Pasta', emoji: '🍝', date: 'Yesterday', servings: 1, note: 'Needs extra sauce when reheating' },
      ],

      setPage: (page) => set({ currentPage: page }),
      setRecipeFilter: (f) => set({ recipeFilter: f }),

      addRecipe: (r) => set((s) => ({ recipes: [...s.recipes, r] })),
      deleteRecipe: (id) => set((s) => ({ recipes: s.recipes.filter((r) => r.id !== id) })),

      assignMeal: (day, meal, recipeId) =>
        set((s) => ({
          weekPlan: { ...s.weekPlan, [day]: { ...s.weekPlan[day], [meal]: recipeId } },
        })),
      removeMeal: (day, meal) =>
        set((s) => ({
          weekPlan: { ...s.weekPlan, [day]: { ...s.weekPlan[day], [meal]: null } },
        })),

      addGroceryItem: (item) => set((s) => ({ grocery: [...s.grocery, item] })),
      removeGroceryItem: (id) => set((s) => ({ grocery: s.grocery.filter((g) => g.id !== id) })),
      toggleGroceryItem: (id) =>
        set((s) => ({
          grocery: s.grocery.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)),
        })),
      clearCheckedGrocery: () => set((s) => ({ grocery: s.grocery.filter((g) => !g.checked) })),

      addPantryItem: (item) => set((s) => ({ pantry: [...s.pantry, item] })),
      removePantryItem: (id) => set((s) => ({ pantry: s.pantry.filter((p) => p.id !== id) })),

      addLeftover: (item) => set((s) => ({ leftovers: [...s.leftovers, item] })),
      removeLeftover: (id) => set((s) => ({ leftovers: s.leftovers.filter((l) => l.id !== id) })),

      addRecipeToGrocery: (recipeId) => {
        const { recipes, grocery } = get()
        const recipe = recipes.find((r) => r.id === recipeId)
        if (!recipe) return
        const newItems: GroceryItem[] = []
        recipe.ingredients.forEach((ing) => {
          const [namePart, qtyPart] = ing.split(',')
          const name = namePart.trim()
          if (!grocery.find((g) => g.name.toLowerCase() === name.toLowerCase())) {
            newItems.push({ id: Date.now() + Math.random(), name, qty: qtyPart?.trim() || '1', category: 'From Recipe', checked: false })
          }
        })
        set((s) => ({ grocery: [...s.grocery, ...newItems] }))
      },

      addWeekToGrocery: () => {
        const { weekPlan, recipes, grocery } = get()
        const newItems: GroceryItem[] = []
        Object.values(weekPlan).forEach((day) => {
          Object.values(day).forEach((recipeId) => {
            if (!recipeId) return
            const recipe = recipes.find((r) => r.id === recipeId)
            if (!recipe) return
            recipe.ingredients.forEach((ing) => {
              const [namePart, qtyPart] = ing.split(',')
              const name = namePart.trim()
              if (
                !grocery.find((g) => g.name.toLowerCase() === name.toLowerCase()) &&
                !newItems.find((g) => g.name.toLowerCase() === name.toLowerCase())
              ) {
                newItems.push({ id: Date.now() + Math.random(), name, qty: qtyPart?.trim() || '1', category: 'From Planner', checked: false })
              }
            })
          })
        })
        set((s) => ({ grocery: [...s.grocery, ...newItems] }))
        return newItems.length
      },
    }),
    {
      name: 'mise-en-place-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
