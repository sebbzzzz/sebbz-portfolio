import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,scss}',
    './components/**/*.{ts,tsx,scss}',
    './src/**/*.{ts,tsx,scss}',
    './pages/**/*.{ts,tsx,scss}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0D0C0C',
          muted: '#232124',
          contrast: '#FFFFFF',
          contrastMuted: '#F3F3F3',
        },
        text: {
          base: '#F3F3F3',
          strong: '#FFFFFF',
          inverse: '#0D0C0C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: [
          'var(--font-plex-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        glow: '0 20px 45px rgba(13, 12, 12, 0.45)',
      },
      borderRadius: {
        badge: '999px',
        card: '1.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
