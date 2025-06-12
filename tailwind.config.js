/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#E4093E',
        accent1: '#518CEA',
        accent2: '#AE6CFC',
        dark: '#2A2A2A',
        secondary: '#7A7A7A',
        tertiary: '#AAAAAA',
        background: '#FEFEFE',
        backgroundAlt: '#FEFEF6',
      },
      fontFamily: {
        comfortaa: ['Comfortaa', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        tiny: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '56px',
        '5xl': '64px',
      },
      borderRadius: {
        DEFAULT: '8px',
        large: '16px',
      },
      boxShadow: {
        regular: '0 0.8px 8px rgba(0, 0, 0, 0.16)',
        small: '0 0.4px 8px rgba(0, 0, 0, 0.16)',
        subtle: '0 0.4px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
