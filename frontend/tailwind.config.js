/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void:     '#080809',
        surface:  '#111114',
        elevated: '#1A1A1F',
        overlay:  '#22222A',
        border: {
          subtle: '#2A2A34',
          dim:    '#3A3A48',
        },
        purple: {
          900: '#1A0840',
          700: '#4A1090',
          500: '#7B2FBE',
          400: '#9B4FDE',
          300: '#B87FEF',
          100: '#EDD9FF',
        },
        wine: {
          900: '#2E0810',
          700: '#5A0F1E',
          500: '#8B1A2E',
          400: '#B02040',
          300: '#D04060',
        },
        gold: {
          900: '#1C1408',
          700: '#7A5C10',
          500: '#C9A84C',
          400: '#E8C56A',
          300: '#F5E29A',
        },
        text: {
          primary:   '#F0F0F5',
          secondary: '#94949E',
          tertiary:  '#5A5A65',
          inverse:   '#080809',
        },
        success: '#2EAF6A',
        warning: '#E8A020',
        error:   '#E83050',
        info:    '#3098E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'purple-glow':    '0 0 0 1px rgba(123, 47, 190, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'purple-glow-lg': '0 0 0 1px rgba(123, 47, 190, 0.3), 0 12px 48px rgba(123, 47, 190, 0.2)',
        'gold-glow':      '0 0 0 1px rgba(201, 168, 76, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'wine-glow':      '0 0 0 1px rgba(139, 26, 46, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'shimmer':    'shimmer 1.5s infinite',
        'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201, 168, 76, 0.4)' },
          '50%':      { boxShadow: '0 0 20px rgba(201, 168, 76, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
