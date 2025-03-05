/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./index.html",            // Include the main HTML file
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
