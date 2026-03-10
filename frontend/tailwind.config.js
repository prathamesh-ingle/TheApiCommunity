/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extracted from the API Community logo
        api: {
          darkTeal: '#0A7294', // The darker left side of the infinity loop
          lightCyan: '#22B3AD', // The brighter right side
          text: '#1F2937',      // Soft black for readable headings
          muted: '#6B7280',     // Gray for secondary text
          bg: '#FAFAFA',        // Soft off-white background from the Framer template
        }
      },
      boxShadow: {
        // Soft shadows for the floating cards and badges
        'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
        'float': '0 10px 30px -10px rgba(10, 114, 148, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem', // For those super rounded cards in the template
      }
    },
  },
  plugins: [],
}