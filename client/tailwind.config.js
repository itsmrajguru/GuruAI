/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Saffron / Amber — the guru flame
        primary: {
          50:  '#fff8ed',
          100: '#ffefd3',
          200: '#ffd9a0',
          300: '#ffbc5e',
          400: '#ff9b28',
          500: '#f07d07',  // Core saffron
          600: '#c45e02',
          700: '#9e4504',
          800: '#7c360a',
          900: '#5c270b',
        },
        // Accent: Deep turmeric / warm ochre — for depth and contrast
        accent: {
          50:  '#fdfbea',
          100: '#faf3c2',
          200: '#f3e47a',
          300: '#e9cc37',
          400: '#d4b020',
          500: '#b38c0e',  // Turmeric gold
          600: '#8f6d0a',
          700: '#6d5009',
          800: '#503a0a',
          900: '#38280a',
        },
        // Surface: Warm parchment / sandalwood — calm backgrounds
        surface: {
          50:  '#fdf7f0',
          100: '#f9ede0',
          200: '#f2d9c0',
          300: '#e8c09a',
          400: '#d9a07a',
          500: '#c97f58',
          600: '#a85e3a',
          700: '#864626',
          800: '#62301a',
          900: '#3e1d0d',
        },
        // Neutral: Warm dark grays with a brownish tint (not cold gray)
        neutral: {
          50:  '#faf8f5',
          100: '#f3ede6',
          200: '#e6d9ce',
          300: '#d0bfb0',
          400: '#b09a88',
          500: '#8f7a6a',
          600: '#6e5e50',
          700: '#4e4137',
          800: '#2e2620',
          900: '#1a1410',
        },
        // Calm: Muted sage/ivory for backgrounds — spiritual stillness
        calm: {
          50:  '#f8f4ee',
          100: '#eee6d9',
          200: '#deccb4',
          300: '#c9ad8a',
          400: '#b48d62',
          500: '#9a7045',
          600: '#7d5733',
          700: '#5e3f24',
          800: '#3d2916',
          900: '#22160c',
        },
      },
      fontFamily: {
        // Display: Cormorant Garamond — ancient, wise, editorial serif
        display: [
          '"Cormorant Garamond"',
          '"Palatino Linotype"',
          'Georgia',
          'serif',
        ],
        // Body: DM Sans — clean, calm, readable
        sans: [
          '"DM Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // Mono: JetBrains Mono for code blocks
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'monospace',
        ],
      },
      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-md': ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.125rem',{ lineHeight: '1.4',  fontWeight: '500' }],
        'body-lg':    ['1.0625rem',{ lineHeight: '1.75', fontWeight: '400' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.6',  fontWeight: '400' }],
        'caption':    ['0.75rem',  { lineHeight: '1.5',  letterSpacing: '0.05em', fontWeight: '500' }],
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '18px',
        '3xl': '28px',
        '4xl': '40px',
      },
      boxShadow: {
        'glow-sm':  '0 0 16px rgba(240, 125, 7, 0.15)',
        'glow-md':  '0 0 32px rgba(240, 125, 7, 0.22)',
        'glow-lg':  '0 0 64px rgba(240, 125, 7, 0.18)',
        'card':     '0 2px 8px rgba(60, 30, 10, 0.07), 0 1px 2px rgba(60, 30, 10, 0.04)',
        'card-hover':'0 12px 40px rgba(60, 30, 10, 0.12), 0 4px 12px rgba(60, 30, 10, 0.06)',
        'dropdown': '0 12px 32px rgba(30, 15, 5, 0.14), 0 4px 10px rgba(30, 15, 5, 0.06)',
        'message':  '0 2px 12px rgba(60, 30, 10, 0.08)',
        'inner-warm':'inset 0 1px 4px rgba(240, 125, 7, 0.08)',
      },
      backgroundImage: {
        // Warm spiritual gradient — main hero/page bg
        'guru-gradient':    'radial-gradient(ellipse at 30% 20%, #fff3d6 0%, #fdf7f0 40%, #f9ede0 100%)',
        // Saffron flame for accents and buttons
        'saffron-flame':    'linear-gradient(135deg, #ff9b28 0%, #f07d07 60%, #c45e02 100%)',
        // Subtle warm glow behind chat bubbles
        'warm-glow':        'radial-gradient(ellipse at center, rgba(240,125,7,0.08) 0%, transparent 70%)',
        // Parchment texture feel for surfaces
        'parchment':        'linear-gradient(160deg, #fdf7f0 0%, #f9ede0 50%, #fdf7f0 100%)',
        // Deep dusk for dark surfaces
        'deep-dusk':        'linear-gradient(160deg, #1a1410 0%, #2e2620 100%)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-up':      'fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'float':        'float 5s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'breath':       'breath 4s ease-in-out infinite',
        'typing':       'typing 1.2s steps(3) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 16px rgba(240,125,7,0.15)' },
          '50%':     { boxShadow: '0 0 40px rgba(240,125,7,0.35)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition:  '200% center' },
        },
        breath: {
          '0%,100%': { transform: 'scale(1)',    opacity: '0.85' },
          '50%':     { transform: 'scale(1.04)', opacity: '1' },
        },
        typing: {
          '0%':   { opacity: '0.3' },
          '50%':  { opacity: '1'   },
          '100%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};