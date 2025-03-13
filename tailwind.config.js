/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgSeatBooking: '#f9f9f9',
      },
      width: {
        half: '50%',
      },
      minWidth: {
        half: '50%',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-left': 'slideInLeft 1s ease-out forwards',
        'typing': 'typing 1s steps(40) 0s 1 normal forwards, hideCursor 2s forwards',
      },
      keyframes: {
        slideInLeft: {
          '0%': {
            transform: 'translateX(-50%)',
            opacity: '0.25',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        hideCursor: {
          '100%': { borderColor: 'transparent' }, // Make the cursor disappear by setting border to transparent
        },
      },
    },
  },
  plugins: [],
  
};


