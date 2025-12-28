module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./styles/**/*.{css}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        bg: "#F8FAFC",
        card: "#FFFFFF",
        muted: "#6B7280"
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};