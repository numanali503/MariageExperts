/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        prime: {
          red: "#FE8578", // Custom light blue
          yellow: "#E3B64E", // Dark blue
          green: "#CACC3D", // Primary blue
        },
      },
    },
  },
  plugins: [],
};
