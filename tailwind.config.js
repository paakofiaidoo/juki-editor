/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("shadcn-ui/tailwind-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/state/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/setup.{js,ts,jsx,tsx,mdx}",
    "./src/App.{js,ts,jsx,tsx,mdx}",
    "./src/main.{js,ts,jsx,tsx,mdx}",
    "./src/index.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}