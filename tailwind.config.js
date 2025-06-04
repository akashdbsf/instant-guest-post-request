/** @type {import('tailwindcss').Config} */
const withTW = require('@bsf/force-ui/withTW');

module.exports = withTW({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './templates/**/*.php',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts with WordPress
  },
  // Add prefix to all Tailwind classes to avoid conflicts with WordPress
  prefix: '',
  important: true, // Make Tailwind styles take precedence
});
