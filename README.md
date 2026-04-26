# Mise en Place — Meal Planner

A full-featured meal planning app built with Next.js 14, Tailwind CSS, and Zustand. Deploy to Vercel in minutes.

## Features

- **Inspire Me** — mood-based recipe discovery, leftover alerts, quick stats
- **Week Planner** — 7-day grid with breakfast/lunch/dinner slots, log meals out
- **Recipes** — filterable library, custom recipes with photo upload
- **Grocery List** — categorized, checkable, auto-populates from recipes/planner
- **Pantry** — track freshness status, expiry warnings
- **Leftovers** — log what's in the fridge, push to planner

All data is persisted to `localStorage` via Zustand — no backend required.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
```

Follow the prompts. Done.

### Option B — GitHub + Vercel UI

1. Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: Mise en Place meal planner"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mise-en-place.git
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new), import your GitHub repo, click **Deploy**.

No environment variables needed. Vercel auto-detects Next.js.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Entry point
│   └── globals.css      # Tailwind + Google Fonts
├── components/
│   ├── App.tsx          # Main shell
│   ├── Sidebar.tsx      # Navigation
│   ├── RecipeCard.tsx   # Recipe card UI
│   ├── pages/
│   │   ├── InspirePage.tsx
│   │   ├── PlannerPage.tsx
│   │   ├── RecipesPage.tsx
│   │   ├── GroceryPage.tsx
│   │   ├── PantryPage.tsx
│   │   └── LeftoversPage.tsx
│   ├── modals/
│   │   ├── AddRecipeModal.tsx
│   │   ├── RecipeDetailModal.tsx
│   │   └── MealPickerModal.tsx
│   └── ui/
│       ├── Modal.tsx
│       └── Toast.tsx
├── hooks/
│   └── useToast.ts
└── store/
    └── index.ts         # Zustand store (persisted)
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management + localStorage persistence |
| Lucide React | Icons |
| Google Fonts | Playfair Display + DM Sans |
