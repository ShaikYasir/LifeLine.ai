/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1f1",
          100: "#ffb5b5",
          200: "#ff9e9e",
          300: "#ff8787",
          400: "#ff7070",
          500: "#ff5959",
          600: "#ff4242",
          700: "#ff2b2b",
          800: "#ff1414",
          900: "#fc0000",
        },
      },
    },
  },
  plugins: [],
};
