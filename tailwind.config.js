/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF8F3',
        'warm-white': '#FFFEF9',
        ink: {
          DEFAULT: '#1C1A15',
          muted: '#6B6357',
          faint: '#A89E93',
        },
        sage: {
          DEFAULT: '#7A9E7E',
          light: '#EDF3EE',
          dark: '#4A6B4E',
        },
        terra: {
          DEFAULT: '#C4714A',
          light: '#F8EDE7',
          dark: '#8B4E32',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#FBF5E6',
          dark: '#8B7030',
        },
        border: {
          DEFAULT: '#E8E3DB',
          dark: '#D0C8BC',
        },
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '18px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(28,26,21,0.08)',
        lg: '0 8px 32px rgba(28,26,21,0.12)',
      },
    },
  },
  plugins: [],
}
