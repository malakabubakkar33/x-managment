/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FF',
          300: '#7CC4FA',
          400: '#38A3F8',
          500: '#0E86D4',
          600: '#0267B5',
          700: '#035293',
          800: '#07467A',
          900: '#0B3B66',
        },
        navy: {
          800: '#152238',
          900: '#0B1528',
          950: '#070D18',
        },
        medical: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'elevated': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 20px 35px -5px rgba(2, 103, 181, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
