/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nirvana: {
          ink: '#1F2A24',
          forestDeep: '#2F4233',
          sageDeep: '#4F5E47',
          sage: '#7A8B6F',
          celadon: '#C8D2BB',
          paper: '#F6F1E8',
          mist: '#E8E4DA',
          stone: '#C9B89C',
          clay: '#A57C5A',
          goldAntique: '#B89968',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3.25rem, 1.4rem + 5.5vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        h1: ['clamp(2.5rem, 1.5rem + 3vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        h2: ['clamp(1.875rem, 1.3rem + 1.8vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['clamp(1.375rem, 1.1rem + 0.9vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        lede: ['clamp(1.125rem, 1rem + 0.4vw, 1.375rem)', { lineHeight: '1.55' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        '2xs': '0.25rem',
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
        '6xl': '12rem',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        md: '6px',
        lg: '12px',
        xl: '20px',
        '2xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        elevated: '0 1px 2px rgba(31, 42, 36, 0.04), 0 4px 12px rgba(122, 139, 111, 0.08)',
        floating:
          '0 2px 4px rgba(31, 42, 36, 0.06), 0 12px 28px rgba(79, 94, 71, 0.10), 0 24px 48px rgba(122, 139, 111, 0.06)',
      },
      transitionTimingFunction: {
        nirvana: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'nirvana-emphasis': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        240: '240ms',
        600: '600ms',
      },
      maxWidth: {
        nirvana: '1280px',
        reading: '720px',
      },
    },
  },
  plugins: [],
};
