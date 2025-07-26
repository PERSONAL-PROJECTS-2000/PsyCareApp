import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        secondary: '#FFC0CB',
      }
    },
  },
  plugins: [],
} satisfies Config
export default config;