/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f0f0f',
          secondary: '#1a1a1a',
          tertiary: '#212121',
        },
        surface: {
          DEFAULT: '#242424',
          elevated: '#2e2e2e',
          hover: '#363636',
        },
        accent: {
          green: '#4CAF50',
          'green-dim': '#2e7d32',
          red: '#FF5252',
          'red-dim': '#c62828',
          blue: '#60a5fa',
          yellow: '#fbbf24',
          orange: '#fb923c',
        },
        border: {
          DEFAULT: '#333333',
          light: '#404040',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        badge: '6px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(76, 175, 80, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
