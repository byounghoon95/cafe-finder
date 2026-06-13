/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          ink: "#1f2933",
          leaf: "#2f6f4e",
          moss: "#dce8cf",
          cream: "#f7f3ea",
        },
      },
      boxShadow: {
        panel: "0 16px 40px rgb(31 41 51 / 0.12)",
      },
    },
  },
  plugins: [],
};
