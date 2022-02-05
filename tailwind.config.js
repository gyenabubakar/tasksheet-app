module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#5C68FF',
        darkmain: '#4452fd',
        darkgray: '#7A7A7A',
        lightgray: '#E8E8E8',
        fakeblack: '#121212',
        secondarybg: '#F5F5F5',
      },
      borderRadius: {
        small: '16px',
        large: '20px',
      },
    },
  },
  plugins: [],
};
