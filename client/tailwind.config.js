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
          50: '#e6f9fe',
          100: '#b3eefb',
          200: '#67ddf8',
          300: '#1ecef4',
          400: '#02bcf0',
          500: '#029ac5',
          600: '#0179a0',
          700: '#01688a',
          800: '#014d65',
          900: '#003347',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.09375rem', fontWeight: '800' }],  // 48px heading
        'display-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],  // 18px body
        'display-md': ['1.75rem', { lineHeight: '1', letterSpacing: '-0.03125rem', fontWeight: '800' }],  // 28px stat
        'display-sm': ['1.125rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],  // section title
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'dropdown': '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};