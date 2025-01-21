/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "card-border": "rgba(12, 75, 181, 0.1)",
      },
      boxShadow: {
        card: "rgba(12, 75, 181, 0.06) 0px 5px 20px",
      },
    },
  },
  plugins: [],
};
