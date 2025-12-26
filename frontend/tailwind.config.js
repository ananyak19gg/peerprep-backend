module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // indigo blue
        accent: '#06B6D4', // teal/cyan accent
        calm: '#2ECC71',
        alert: '#F6C84C',
        urgent: '#F44336',
        card: '#FFFFFF',
        muted: '#6B7280',
        bg: '#F8FAFC'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(17, 24, 39, 0.06)'
      },
      borderRadius: {
        xl: '12px'
      }
    }
  },
  plugins: []
};