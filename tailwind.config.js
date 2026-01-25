/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode semantic colors
        background: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
        },
        foreground: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
        },
        border: '#E2E8F0',
        'hover-bg': '#F1F5F9',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
      },
    },
  },
  plugins: [],
}
