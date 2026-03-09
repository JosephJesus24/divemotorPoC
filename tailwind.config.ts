import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Automotive dark base ────────────────────────────────────────────────
        bg: {
          primary:   '#09090b',
          secondary: '#111113',
          card:      '#16161a',
          hover:     '#1e1e24',
        },
        border: {
          DEFAULT: '#2a2a32',
          light:   '#3f3f50',
        },
        // ── Divemotor brand colors ──────────────────────────────────────────────
        // Torch Red  #fe142f  — primary CTA, accent
        // Regal Blue #003a75  — secondary, informational, nav stripe
        accent: {
          DEFAULT: '#fe142f',   // Divemotor Torch Red
          hover:   '#ff3347',   // lighter red for hover
          muted:   '#801020',   // dark red for subtle tints
          blue:    '#003a75',   // Divemotor Regal Blue
          'blue-hover': '#004d9e',
        },
        text: {
          primary:   '#f5f5f7',
          secondary: '#a0a0b0',
          muted:     '#66667a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer:    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
