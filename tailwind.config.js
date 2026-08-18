/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        backdrop: "#0B0F14",
        surface: "#111823",
        surface2: "#161F2C",
        line: "#22303F",
        copper: "#C9814B",
        copperbright: "#E8A15C",
        signal: "#3FA9F5",
        ink: "#E7EDF3",
        muted: "#7C8B9B",
        danger: "#E0654F",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(#22303F 1px, transparent 1px), linear-gradient(90deg, #22303F 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
