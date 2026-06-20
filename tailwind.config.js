/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#F9F8F6',
        'bg-surface': '#F2F0EB',
        'text-primary': '#2C2A29',
        'text-muted': '#757371',
        'accent-gold': '#D4AF37',
        'accent-gold-light': '#E8CC6E',
        'accent-gold-dark': '#B8941F',
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      spacing: {
        'xs': '0.5rem',
        'xl': '6rem',
        'section': '12rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.85, 0, 0.15, 1)',
      },
    },
  },
  plugins: [],
}
