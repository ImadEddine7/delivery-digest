/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a2e',
        slate: '#4a4e69',
        mist: '#f0f1f5',
        accent: '#2f6f6b',
        'accent-light': '#e8f4f3',
        danger: '#b4472f',
        warning: '#c08a2e',
        success: '#2f6f6b',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
    },
  },
  plugins: [],
}
