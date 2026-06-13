/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f8f5ef",
          100: "#eee5d4",
          500: "#8b5e34",
          700: "#56351f",
          900: "#26180f",
        },
      },
    },
  },
  plugins: [],
};
