/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agentrix: {
          bg: "#f3f4f9",
          card: "#ffffff",
          darkCard: "#191924",
          sidebar: "#ffffff",
          accentBlue: "#1882ff",
          accentTeal: "#10b981",
          accentPeach: "#ffd8c4",
          accentLavender: "#d5d5fa"
        }
      }
    },
  },
  plugins: [],
}
