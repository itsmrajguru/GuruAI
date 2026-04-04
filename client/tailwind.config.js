/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff8ed',
          100: '#fff3d6',
          200: '#ffd9a0',
          300: '#ffbc5e',
          400: '#ff9b28',
          500: '#f07d07',  
          600: '#c45e02',
          700: '#9e4504',
          800: '#7c360a',
          900: '#5c270b',
        },
        accent: {
          50:  '#fdfbea',
          100: '#faf3c2',
          200: '#f3e47a',
          300: '#e9cc37',
          400: '#d4b020',
          500: '#b38c0e',  
          600: '#8f6d0a',
          700: '#6d5009',
          800: '#503a0a',
          900: '#38280a',
        },

        surface: {
          50:  '#fffaf4',   // page background
          100: '#fff8ed',   // pill / badge backgrounds
          200: '#fff3d6',   // orb / soft ambient
          300: '#f9ede0',   // subtle section bg
          400: '#f2e4d2',   // card borders
          500: '#e8d5be',   // input underlines, dividers
          600: '#c9ad8a',   // placeholder text
          700: '#9a7045',   // muted body text
          800: '#7d5733',   // tagline, darker muted
          900: '#4e4137',   // secondary text
        },
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
          900: '#1a1410',   // primary text, dark button
        },
      },

      fontFamily: {
       
        display: [
          '"Cormorant Garamond"',
          '"Palatino Linotype"',
          'Georgia',
          'serif',
        ],

        sans: [
          '"DM Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],

        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'monospace',
        ],
      },

      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-lg': ['2rem',    { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '600' }],
        'display-md': ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        'display-sm': ['1.125rem',{ lineHeight: '1.4',  letterSpacing: '-0.005em', fontWeight: '500' }],
        'body-lg':    ['1.0625rem',{ lineHeight: '1.75', fontWeight: '400' }],
        'body-md':    ['0.9375rem',{ lineHeight: '1.7',  fontWeight: '400' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.6',  fontWeight: '400' }],
        'label':      ['0.75rem',  { lineHeight: '1.5',  letterSpacing: '0.08em',  fontWeight: '700' }],
        'caption':    ['0.72rem',  { lineHeight: '1.4',  letterSpacing: '0.09em',  fontWeight: '700' }],
      },

      borderRadius: {
        'xl':  '12px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
        'pill': '9999px',
      },

      boxShadow: {
        'card':        '0 4px 32px rgba(180,100,10,0.07), 0 1px 4px rgba(180,100,10,0.04)',
        'card-hover':  '0 12px 48px rgba(180,100,10,0.12), 0 4px 12px rgba(180,100,10,0.06)',
        'glow-sm':     '0 0 16px rgba(240,125,7,0.18)',
        'glow-md':     '0 0 32px rgba(240,125,7,0.28)',
        'btn-saffron': '0 4px 18px rgba(240,125,7,0.35)',
        'orb-amber':   '0 0 120px 40px rgba(255,210,130,0.28)',
      },

      backgroundImage: {
        'saffron-flame':  'linear-gradient(135deg, #ff9b28 0%, #f07d07 60%, #c45e02 100%)',
        'gold-accent':    'linear-gradient(90deg, #fff8ed 0%, #f07d07 40%, #b38c0e 80%, #fff8ed 100%)',
        'page-bg':        'radial-gradient(ellipse at 20% 10%, rgba(255,210,130,0.28) 0%, transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(240,125,7,0.10) 0%, transparent 50%)',
      },

      animation: {
        'fade-up':      'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'fade-up-late': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both',
        'spin-slow':    'spin 24s linear infinite',
        'spin-rev':     'spinRev 18s linear infinite',
        'breath':       'breath 4s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2.5s ease-in-out infinite',
        'float':        'float 5s ease-in-out infinite',
        'spinner':      'spin 0.7s linear infinite',
      },

      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        spinRev: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(-360deg)' },
        },
        breath: {
          '0%,100%': { transform: 'scale(1)',    opacity: '0.7' },
          '50%':     { transform: 'scale(1.04)', opacity: '1'   },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 8px rgba(240,125,7,0.4)' },
          '50%':     { boxShadow: '0 0 22px rgba(240,125,7,0.85)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)'  },
          '50%':     { transform: 'translateY(-10px)' },
        },
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};