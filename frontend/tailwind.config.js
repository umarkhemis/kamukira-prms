module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8f7',
          100: '#d2eeeb',
          200: '#a7ddd7',
          500: '#0f766e',
          600: '#0b5f59',
          700: '#0a4f4a',
          800: '#083f3c',
          900: '#072f2d',
        },
        health: {
          green: '#15803d',
          red: '#b91c1c',
          yellow: '#a16207',
          blue: '#0f766e',
        }
      },
      boxShadow: {
        soft: '0 1px 2px rgba(2, 6, 23, 0.06), 0 8px 24px rgba(2, 6, 23, 0.06)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}
