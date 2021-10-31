module.exports = {
  presets: [require('anyas/tailwind')],
  purge: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      spacing: {
        1: '1px',
        2: '2px',
      },
    },
  },
};
