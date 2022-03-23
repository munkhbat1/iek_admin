module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'ul': {
              '> li': {
                '&::before': {
                  'background-color': '#6b7280',
                },
              },
            },
            tbody: {
              tr: {
                'border-bottom-color': '#6b7280',
              },
            },
            thead: {
              'border-bottom-color': '#111827',
            },
            blockquote: {
              'border-left-color': '#1f2937',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}